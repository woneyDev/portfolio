package com.portfolio.api.config;

import com.portfolio.api.service.AllowedIpService;
import com.portfolio.api.session.SessionManager;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * GitHub Pages와 로컬 개발 서버에서 API를 호출할 수 있도록 CORS를 허용합니다.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final SessionManager sessionManager;
    private final AllowedIpService allowedIpService;

    public WebConfig(SessionManager sessionManager, AllowedIpService allowedIpService) {
        this.sessionManager = sessionManager;
        this.allowedIpService = allowedIpService;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "https://woneydepp.github.io",
                        "http://localhost:3000",
                        "http://localhost:8080",
                        // VPS 운영 서버 — 도메인 연결 전까지 IP 주소로 직접 접속하는 프론트엔드를 허용한다.
                        // 도메인이 생기면 이 줄은 그 도메인 주소로 교체하고 지운다.
                        "http://138.2.24.46:8080"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 1단계: IP 허용 목록 검사 — 로그인·소셜 로그인·마이페이지 관련 요청은 등록된 접속 위치에서만 통과한다.
        // 여기를 통과해야만 아래 2단계(로그인 세션 검증)로 넘어간다.
        registry.addInterceptor(new IpAllowlistInterceptor(allowedIpService))
                .addPathPatterns(
                        "/api/auth/login",
                        "/api/auth/oauth/**",
                        "/api/portfolio/me",
                        "/api/portfolio/me/**");

        // 2단계: 로그인 세션(토큰) 검증 — 마이페이지 관련 요청만 대상으로, 실제 로그인한 회원인지 서버가 직접 확인한다.
        registry.addInterceptor(new AuthInterceptor(sessionManager))
                .addPathPatterns("/api/portfolio/me/**", "/api/portfolio/me");
    }
}
