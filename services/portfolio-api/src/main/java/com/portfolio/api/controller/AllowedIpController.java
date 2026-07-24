package com.portfolio.api.controller;

import com.portfolio.api.config.AuthInterceptor;
import com.portfolio.api.dto.AllowedIpResponse;
import com.portfolio.api.dto.CreateAllowedIpRequest;
import com.portfolio.api.service.AllowedIpService;
import com.portfolio.api.service.DuplicateFieldException;
import com.portfolio.api.service.InvalidIpAddressException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 로그인/마이페이지 접속을 허용할 IP 목록 관리 — 이 경로 자체도 WebConfig의
 * "/api/portfolio/me/**" 패턴에 걸려 IP 허용목록 통과 + 로그인 세션 검증을 그대로 받는다.
 */
@RestController
@RequestMapping("/api/portfolio/me/allowed-ips")
public class AllowedIpController {

    private final AllowedIpService allowedIpService;

    public AllowedIpController(AllowedIpService allowedIpService) {
        this.allowedIpService = allowedIpService;
    }

    @GetMapping
    public ResponseEntity<List<AllowedIpResponse>> list(
            @RequestAttribute(AuthInterceptor.MEMBER_ID_ATTRIBUTE) Long memberId) {
        return ResponseEntity.ok(allowedIpService.list().stream().map(AllowedIpResponse::from).toList());
    }

    @PostMapping
    public ResponseEntity<?> add(
            @RequestAttribute(AuthInterceptor.MEMBER_ID_ATTRIBUTE) Long memberId,
            @Valid @RequestBody CreateAllowedIpRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(AllowedIpResponse.from(allowedIpService.add(request.ipAddress(), request.memo())));
        } catch (InvalidIpAddressException | DuplicateFieldException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(
            @RequestAttribute(AuthInterceptor.MEMBER_ID_ATTRIBUTE) Long memberId,
            @PathVariable Long id) {
        allowedIpService.remove(id);
        return ResponseEntity.noContent().build();
    }
}
