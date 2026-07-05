package com.portfolio.api.controller;

import com.portfolio.api.config.AuthInterceptor;
import com.portfolio.api.dto.PortfolioResponse;
import com.portfolio.api.dto.UpdatePortfolioRequest;
import com.portfolio.api.service.PortfolioService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/portfolio/{username}")
    public ResponseEntity<String> getPortfolioByUsername(@PathVariable String username) {
        try {
            String json = portfolioService.getPortfolioJsonByUsername(username.toLowerCase());
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Cache-Control", "public, max-age=60")
                    .body(json);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/portfolio/me")
    public ResponseEntity<PortfolioResponse> getMyPortfolio(
            @RequestAttribute(AuthInterceptor.MEMBER_ID_ATTRIBUTE) Long memberId) {
        return ResponseEntity.ok(portfolioService.getMyPortfolio(memberId));
    }

    @PutMapping("/portfolio/me")
    public ResponseEntity<PortfolioResponse> updateMyPortfolio(
            @RequestAttribute(AuthInterceptor.MEMBER_ID_ATTRIBUTE) Long memberId,
            @Valid @RequestBody UpdatePortfolioRequest request) {
        return ResponseEntity.ok(portfolioService.updateMyPortfolio(memberId, request));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "portfolio-api"));
    }
}
