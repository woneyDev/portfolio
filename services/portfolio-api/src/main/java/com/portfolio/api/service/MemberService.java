package com.portfolio.api.service;

import com.portfolio.api.dto.RegisterRequest;
import com.portfolio.api.entity.Member;
import com.portfolio.api.entity.PortfolioOwner;
import com.portfolio.api.entity.SectionLayout;
import com.portfolio.api.entity.SectionType;
import com.portfolio.api.repository.MemberRepository;
import com.portfolio.api.repository.PortfolioOwnerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class MemberService {

    private static final String EMAIL_CHECK_KEY_PREFIX = "signup:email-check:";
    private static final Duration EMAIL_CHECK_TTL = Duration.ofSeconds(20);
    private static final String DEFAULT_OAUTH_AFFILIATION = "미입력";

    private final MemberRepository memberRepository;
    private final PortfolioOwnerRepository portfolioOwnerRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final RedisTemplate<String, String> redisTemplate;

    @Value("${app.frontend-url:http://localhost:8080}")
    private String frontendUrl;

    public MemberService(MemberRepository memberRepository,
                          PortfolioOwnerRepository portfolioOwnerRepository,
                          BCryptPasswordEncoder passwordEncoder,
                          MailService mailService,
                          RedisTemplate<String, String> redisTemplate) {
        this.memberRepository = memberRepository;
        this.portfolioOwnerRepository = portfolioOwnerRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
        this.redisTemplate = redisTemplate;
    }

    @Transactional
    public Member register(RegisterRequest request) {
        String email = request.email().toLowerCase();

        if (!request.password().equals(request.passwordConfirm())) {
            throw new PasswordMismatchException();
        }
        if (memberRepository.existsByEmail(email)) {
            throw new DuplicateFieldException("이미 사용 중인 이메일입니다.");
        }

        Member member = new Member();
        member.setEmail(email);
        member.setPasswordHash(passwordEncoder.encode(request.password()));
        member.setNickname(request.nickname());
        member.setAffiliation(request.affiliation());
        member.setEmailVerified(false);
        member.setVerificationToken(UUID.randomUUID().toString());
        member.setVerificationTokenExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS));
        member.setCreatedAt(Instant.now());

        try {
            member = memberRepository.save(member);
        } catch (DataIntegrityViolationException e) {
            // 거의 동시에 같은 이메일로 두 명이 가입을 시도한 경우(경쟁 상태)의 최종 방어선.
            throw new DuplicateFieldException("이미 사용 중인 이메일입니다.");
        }

        member.setUsername(generateHandle(member.getId()));
        member = memberRepository.save(member);

        createBlankPortfolio(member, email);

        String verificationUrl = frontendUrl + "/#/verify-email?token=" + member.getVerificationToken();
        mailService.sendVerificationEmail(member.getEmail(), verificationUrl);

        return member;
    }

    /**
     * 화면에서 이메일을 입력하는 동안 실시간으로 사용 가능 여부를 물어볼 때 쓰는 조회.
     * 같은 값을 반복 조회할 때 DB까지 매번 가지 않도록 Redis에 결과를 짧게 캐싱한다.
     */
    public boolean isEmailAvailable(String email) {
        String normalized = email.toLowerCase();
        String key = EMAIL_CHECK_KEY_PREFIX + normalized;

        String cached = redisTemplate.opsForValue().get(key);
        if (cached != null) {
            return "available".equals(cached);
        }

        boolean available = !memberRepository.existsByEmail(normalized);
        redisTemplate.opsForValue().set(key, available ? "available" : "taken", EMAIL_CHECK_TTL);
        return available;
    }

    /**
     * 소셜 로그인(구글/카카오/네이버)으로 처음 들어온 사용자를 위한 회원 조회/생성.
     * 같은 이메일의 기존 회원이 있으면 그 회원으로 간주해 연결하고, 없으면 새로 만든다.
     * 소셜 로그인은 해당 서비스가 이미 이메일을 검증했으므로 emailVerified=true로 시작하고
     * 비밀번호는 없다(passwordHash=null) — 나중에 원하면 비밀번호를 별도로 설정할 수 있다.
     * 닉네임/소속을 직접 입력받는 화면은 아직 없어(소셜 로그인 버튼 자체가 비활성 상태),
     * 임시값으로 채워 넣는다.
     */
    @Transactional
    public Member findOrCreateForOAuth(String email) {
        String normalizedEmail = email.toLowerCase();
        return memberRepository.findByEmail(normalizedEmail)
                .orElseGet(() -> {
                    Member member = new Member();
                    member.setEmail(normalizedEmail);
                    member.setPasswordHash(null);
                    member.setEmailVerified(true);
                    member.setNickname(normalizedEmail.substring(0, normalizedEmail.indexOf('@')));
                    member.setAffiliation(DEFAULT_OAUTH_AFFILIATION);
                    member.setCreatedAt(Instant.now());
                    Member saved = memberRepository.save(member);
                    saved.setUsername(generateHandle(saved.getId()));
                    saved = memberRepository.save(saved);
                    createBlankPortfolio(saved, normalizedEmail);
                    return saved;
                });
    }

    /** 개인 포트폴리오 주소(예: mysite.com/@u1024)에 쓸 값 — 회원번호 기반이라 항상 고유하고 이메일이 노출되지 않는다. */
    private String generateHandle(Long memberId) {
        return "u" + memberId;
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
