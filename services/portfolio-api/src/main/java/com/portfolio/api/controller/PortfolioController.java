package com.portfolio.api.controller;

import com.portfolio.api.config.AuthInterceptor;
import com.portfolio.api.dto.CreateCustomSectionRequest;
import com.portfolio.api.dto.PortfolioResponse;
import com.portfolio.api.dto.UpdateCustomSectionRequest;
import com.portfolio.api.dto.UpdateLayoutRequest;
import com.portfolio.api.dto.UpdatePortfolioRequest;
import com.portfolio.api.service.InvalidLayoutException;
import com.portfolio.api.service.PortfolioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<String> getPortfolioByUsername(
            @PathVariable String username,
            @RequestParam(defaultValue = "ko") String lang) {
        try {
            String normalizedLang = "en".equalsIgnoreCase(lang) ? "en" : "ko";
            String json = portfolioService.getPortfolioJsonByUsername(username.toLowerCase(), normalizedLang);
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

    @PutMapping("/portfolio/me/layout")
    public ResponseEntity<?> updateMyLayout(
            @RequestAttribute(AuthInterceptor.MEMBER_ID_ATTRIBUTE) Long memberId,
            @Valid @RequestBody UpdateLayoutRequest request) {
        try {
            return ResponseEntity.ok(portfolioService.updateMyLayout(memberId, request));
        } catch (InvalidLayoutException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/portfolio/me/custom-sections")
    public ResponseEntity<PortfolioResponse> addCustomSection(
            @RequestAttribute(AuthInterceptor.MEMBER_ID_ATTRIBUTE) Long memberId,
            @Valid @RequestBody CreateCustomSectionRequest request) {
        return ResponseEntity.ok(portfolioService.addCustomSection(memberId, request));
    }

    @PutMapping("/portfolio/me/custom-sections/{sectionId}")
    public ResponseEntity<PortfolioResponse> updateCustomSection(
            @RequestAttribute(AuthInterceptor.MEMBER_ID_ATTRIBUTE) Long memberId,
            @PathVariable Long sectionId,
            @Valid @RequestBody UpdateCustomSectionRequest request) {
        return ResponseEntity.ok(portfolioService.updateCustomSection(memberId, sectionId, request));
    }

    @DeleteMapping("/portfolio/me/custom-sections/{sectionId}")
    public ResponseEntity<PortfolioResponse> deleteCustomSection(
            @RequestAttribute(AuthInterceptor.MEMBER_ID_ATTRIBUTE) Long memberId,
            @PathVariable Long sectionId) {
        return ResponseEntity.ok(portfolioService.deleteCustomSection(memberId, sectionId));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "portfolio-api"));
    }
}
