package com.portfolio.api.controller;

import com.portfolio.api.dto.PortfolioResponse;
import com.portfolio.api.service.PortfolioService;
import com.portfolio.api.session.SessionManager;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final SessionManager sessionManager;

    @Value("${admin.password}")
    private String adminPassword;

    public PortfolioController(PortfolioService portfolioService, SessionManager sessionManager) {
        this.portfolioService = portfolioService;
        this.sessionManager = sessionManager;
    }

    @GetMapping("/portfolio")
    public ResponseEntity<PortfolioResponse> getPortfolio() {
        return ResponseEntity.ok(portfolioService.getPortfolio());
    }

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String userId = credentials.get("userId");
        String password = credentials.get("password");

        if (!"admin".equals(userId) || !adminPassword.equals(password)) {
            return ResponseEntity.status(401).body(Map.of("error", "인증 실패"));
        }

        String token = sessionManager.createSession(userId);
        return ResponseEntity.ok(Map.of("token", token, "message", "로그인 성공"));
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        String token = extractToken(request);
        if (token != null) {
            sessionManager.invalidateSession(token);
        }
        return ResponseEntity.ok(Map.of("message", "로그아웃 완료"));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "portfolio-api"));
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}