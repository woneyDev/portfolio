package com.portfolio.api.controller;

import com.portfolio.api.entity.Member;
import com.portfolio.api.service.InvalidOAuthStateException;
import com.portfolio.api.service.OAuthService;
import com.portfolio.api.session.SessionManager;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/auth/oauth")
public class OAuthController {

    private final OAuthService oauthService;
    private final SessionManager sessionManager;

    @Value("${app.frontend-url:http://localhost:8080}")
    private String frontendUrl;

    public OAuthController(OAuthService oauthService, SessionManager sessionManager) {
        this.oauthService = oauthService;
        this.sessionManager = sessionManager;
    }

    @GetMapping("/{provider}/authorize")
    public ResponseEntity<Void> authorize(@PathVariable String provider) {
        if (!oauthService.isKnownProvider(provider)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        String url = oauthService.buildAuthorizeUrl(provider);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(url)).build();
    }

    @GetMapping("/{provider}/callback")
    public ResponseEntity<Void> callback(@PathVariable String provider,
                                          @RequestParam(required = false) String code,
                                          @RequestParam(required = false) String state) {
        if (code == null || state == null) {
            return redirectToLogin("oauth_failed");
        }
        try {
            Member member = oauthService.handleCallback(provider, code, state);
            String token = sessionManager.createSession(member.getId().toString());
            String url = frontendUrl + "/#/oauth-callback?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(url)).build();
        } catch (InvalidOAuthStateException | IllegalArgumentException e) {
            return redirectToLogin("oauth_failed");
        }
    }

    private ResponseEntity<Void> redirectToLogin(String errorCode) {
        String url = frontendUrl + "/#/admin?error=" + errorCode;
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(url)).build();
    }
}
