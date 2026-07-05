package com.portfolio.api.repository;

import com.portfolio.api.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByUsername(String username);

    Optional<Member> findByEmail(String email);

    Optional<Member> findByVerificationToken(String token);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
