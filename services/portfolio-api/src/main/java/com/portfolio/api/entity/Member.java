package com.portfolio.api.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "member",
       uniqueConstraints = {
           @UniqueConstraint(name = "uq_member_username", columnNames = "username"),
           @UniqueConstraint(name = "uq_member_email", columnNames = "email")
       })
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 가입 신청 시점엔 회원번호를 아직 몰라 비어있다가, 저장 후 "u"+회원번호로 채워짐(항상 결과적으로 값이 채워짐)
    @Column(length = 30)
    private String username;

    @Column(nullable = false)
    private String email;

    // 소셜 로그인만으로 가입한 회원은 비밀번호가 없어 null일 수 있음
    @Column(name = "password_hash", length = 60)
    private String passwordHash;

    // 화면에 보이는 표시 이름 — 중복 허용, 자유 입력
    @Column(nullable = false, length = 30)
    private String nickname;

    // 예: 구직자/현직 개발자/인사·채용담당자/수강생/그 외(직접입력)
    @Column(nullable = false, length = 100)
    private String affiliation;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "verification_token", length = 36)
    private String verificationToken;

    @Column(name = "verification_token_expires_at")
    private Instant verificationTokenExpiresAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public Member() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getAffiliation() { return affiliation; }
    public void setAffiliation(String affiliation) { this.affiliation = affiliation; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public String getVerificationToken() { return verificationToken; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }

    public Instant getVerificationTokenExpiresAt() { return verificationTokenExpiresAt; }
    public void setVerificationTokenExpiresAt(Instant verificationTokenExpiresAt) { this.verificationTokenExpiresAt = verificationTokenExpiresAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
