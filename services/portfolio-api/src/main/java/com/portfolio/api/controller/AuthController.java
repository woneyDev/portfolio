package com.portfolio.api.controller;

import com.portfolio.api.dto.LoginRequest;
import com.portfolio.api.dto.RegisterRequest;
import com.portfolio.api.entity.Member;
import com.portfolio.api.service.DuplicateFieldException;
import com.portfolio.api.service.EmailNotVerifiedException;
import com.portfolio.api.service.InvalidCredentialsException;
import com.portfolio.api.service.InvalidVerificationTokenException;
import com.portfolio.api.service.MemberService;
import com.portfolio.api.service.PasswordMismatchException;
import com.portfolio.api.session.SessionManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final MemberService memberService;
    private final SessionManager sessionManager;

    public AuthController(MemberService memberService, SessionManager sessionManager) {
        this.memberService = memberService;
        this.sessionManager = sessionManager;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            Member member = memberService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "가입 확인 이메일을 보냈습니다. 인증 후 로그인해주세요.", "username", member.getUsername()));
        } catch (DuplicateFieldException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (PasswordMismatchException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        return ResponseEntity.ok(Map.of("available", memberService.isEmailAvailable(email)));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam String token) {
        try {
            memberService.verifyEmail(token);
            return ResponseEntity.ok(Map.of("message", "이메일 인증이 완료되었습니다."));
        } catch (InvalidVerificationTokenException e) {
            return ResponseEntity.status(HttpStatus.GONE).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginRequest request) {
        try {
            Member member = memberService.authenticate(request.usernameOrEmail(), request.password());
            String token = sessionManager.createSession(member.getId().toString());
            return ResponseEntity.ok(Map.of("token", token, "username", member.getUsername(), "message", "로그인 성공"));
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        } catch (EmailNotVerifiedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        String token = extractToken(request);
        if (token != null) {
            sessionManager.invalidateSession(token);
        }
        return ResponseEntity.ok(Map.of("message", "로그아웃 완료"));
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
