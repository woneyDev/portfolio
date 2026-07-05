package com.portfolio.api.service;

import com.portfolio.api.dto.RegisterRequest;
import com.portfolio.api.entity.Member;
import com.portfolio.api.entity.PortfolioOwner;
import com.portfolio.api.repository.MemberRepository;
import com.portfolio.api.repository.PortfolioOwnerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
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

        PortfolioOwner owner = new PortfolioOwner();
        owner.setTitle("");
        owner.setSubtitle("");
        owner.setEmail(email);
        owner.setGithubUrl("");
        owner.setMember(member);
        portfolioOwnerRepository.save(owner);

        String verificationUrl = frontendUrl + "/#/verify-email?token=" + member.getVerificationToken();
        mailService.sendVerificationEmail(member.getEmail(), verificationUrl);

        return member;
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

        if (!passwordEncoder.matches(rawPassword, member.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }
        if (!member.isEmailVerified()) {
            throw new EmailNotVerifiedException();
        }
        return member;
    }
}
