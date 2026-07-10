package com.portfolio.api.service;

import com.portfolio.api.dto.RegisterRequest;
import com.portfolio.api.entity.Member;
import com.portfolio.api.entity.PortfolioOwner;
import com.portfolio.api.entity.SectionLayout;
import com.portfolio.api.entity.SectionType;
import com.portfolio.api.repository.MemberRepository;
import com.portfolio.api.repository.PortfolioOwnerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class MemberService {

    private static final Set<String> RESERVED_USERNAMES = Set.of(
            "admin", "api", "login", "register", "verify-email", "health", "static", "assets", "portfolio"
    );

    private final MemberRepository memberRepository;
    private final PortfolioOwnerRepository portfolioOwnerRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final MailService mailService;

    @Value("${app.frontend-url:http://localhost:8080}")
    private String frontendUrl;

    public MemberService(MemberRepository memberRepository,
                          PortfolioOwnerRepository portfolioOwnerRepository,
                          BCryptPasswordEncoder passwordEncoder,
                          MailService mailService) {
        this.memberRepository = memberRepository;
        this.portfolioOwnerRepository = portfolioOwnerRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
    }

    @Transactional
    public Member register(RegisterRequest request) {
        String username = request.username().toLowerCase();
        String email = request.email().toLowerCase();

        if (RESERVED_USERNAMES.contains(username)) {
            throw new DuplicateFieldException("사용할 수 없는 아이디입니다: " + username);
        }
        if (memberRepository.existsByUsername(username)) {
            throw new DuplicateFieldException("이미 사용 중인 아이디입니다.");
        }
        if (memberRepository.existsByEmail(email)) {
            throw new DuplicateFieldException("이미 사용 중인 이메일입니다.");
        }

        Member member = new Member();
        member.setUsername(username);
        member.setEmail(email);
        member.setPasswordHash(passwordEncoder.encode(request.password()));
        member.setEmailVerified(false);
        member.setVerificationToken(UUID.randomUUID().toString());
        member.setVerificationTokenExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS));
        member.setCreatedAt(Instant.now());
        member = memberRepository.save(member);

        createBlankPortfolio(member, email);

        String verificationUrl = frontendUrl + "/#/verify-email?token=" + member.getVerificationToken();
        mailService.sendVerificationEmail(member.getEmail(), verificationUrl);

        return member;
    }

    /**
     * 소셜 로그인(구글/카카오/네이버)으로 처음 들어온 사용자를 위한 회원 조회/생성.
     * 같은 이메일의 기존 회원이 있으면 그 회원으로 간주해 연결하고, 없으면 새로 만든다.
     * 소셜 로그인은 해당 서비스가 이미 이메일을 검증했으므로 emailVerified=true로 시작하고
     * 비밀번호는 없다(passwordHash=null) — 나중에 원하면 비밀번호를 별도로 설정할 수 있다.
     */
    @Transactional
    public Member findOrCreateForOAuth(String email) {
        String normalizedEmail = email.toLowerCase();
        return memberRepository.findByEmail(normalizedEmail)
                .orElseGet(() -> {
                    Member member = new Member();
                    member.setUsername(generateUniqueUsername(normalizedEmail));
                    member.setEmail(normalizedEmail);
                    member.setPasswordHash(null);
                    member.setEmailVerified(true);
                    member.setCreatedAt(Instant.now());
                    Member saved = memberRepository.save(member);
                    createBlankPortfolio(saved, normalizedEmail);
                    return saved;
                });
    }

    private void createBlankPortfolio(Member member, String contactEmail) {
        PortfolioOwner owner = new PortfolioOwner();
        owner.setTitle("");
        owner.setSubtitle("");
        owner.setEmail(contactEmail);
        owner.setGithubUrl("");
        owner.setMember(member);
        owner.setSectionLayouts(defaultSectionLayouts(owner));
        portfolioOwnerRepository.save(owner);
    }

    /**
     * 신규 회원의 기본 배치 — 세로 1열: 자기소개 → 스킬 → 프로젝트 → 경력사항, 전부 표시.
     * 격자는 12칸 기준(가로폭 12 = 전체 폭). DB 마이그레이션(V4, V5)에서 기존 회원에게
     * 백필한 좌표와 동일하게 맞춘다.
     */
    private Set<SectionLayout> defaultSectionLayouts(PortfolioOwner owner) {
        Set<SectionLayout> layouts = new LinkedHashSet<>();
        layouts.add(layout(owner, SectionType.HERO, 0, 0, 12, 2));
        layouts.add(layout(owner, SectionType.SKILLS, 0, 2, 12, 2));
        layouts.add(layout(owner, SectionType.PROJECTS, 0, 4, 12, 3));
        layouts.add(layout(owner, SectionType.CAREER, 0, 7, 12, 2));
        return layouts;
    }

    private SectionLayout layout(PortfolioOwner owner, SectionType type, int x, int y, int w, int h) {
        SectionLayout layout = new SectionLayout();
        layout.setOwner(owner);
        layout.setSectionType(type);
        layout.setGridX(x);
        layout.setGridY(y);
        layout.setGridWidth(w);
        layout.setGridHeight(h);
        layout.setVisible(true);
        return layout;
    }

    private String generateUniqueUsername(String email) {
        String base = email.substring(0, email.indexOf('@')).toLowerCase()
                .replaceAll("[^a-z0-9_-]", "");
        if (base.isEmpty() || !base.matches("^[a-z0-9].*")) {
            base = "user" + base;
        }
        if (base.length() > 27) {
            base = base.substring(0, 27);
        }

        String candidate = base;
        int suffix = 2;
        while (RESERVED_USERNAMES.contains(candidate) || memberRepository.existsByUsername(candidate)) {
            candidate = base + suffix;
            suffix++;
        }
        return candidate;
    }

    @Transactional
    public void verifyEmail(String token) {
        Member member = memberRepository.findByVerificationToken(token)
                .orElseThrow(InvalidVerificationTokenException::new);

        if (member.getVerificationTokenExpiresAt() == null
                || member.getVerificationTokenExpiresAt().isBefore(Instant.now())) {
            throw new InvalidVerificationTokenException();
        }

        member.setEmailVerified(true);
        member.setVerificationToken(null);
        member.setVerificationTokenExpiresAt(null);
    }

    public Member authenticate(String usernameOrEmail, String rawPassword) {
        String normalized = usernameOrEmail.toLowerCase();
        Member member = memberRepository.findByUsername(normalized)
                .or(() -> memberRepository.findByEmail(normalized))
                .orElseThrow(InvalidCredentialsException::new);

        if (member.getPasswordHash() == null || !passwordEncoder.matches(rawPassword, member.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }
        if (!member.isEmailVerified()) {
            throw new EmailNotVerifiedException();
        }
        return member;
    }
}
