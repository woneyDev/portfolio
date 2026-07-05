package com.portfolio.api.config;

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

    public WebConfig(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "https://woneydepp.github.io",
                        "http://localhost:3000",
                        "http://localhost:8080"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AuthInterceptor(sessionManager))
                .addPathPatterns("/api/portfolio/me/**", "/api/portfolio/me");
    }
}
