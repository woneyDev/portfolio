package com.portfolio.api.config;

import com.portfolio.api.session.SessionManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Authorization: Bearer 토큰을 서버에서 실제로 검증합니다.
 * 유효하면 요청 속성 "memberId"에 로그인한 회원의 id를 저장합니다 — 클라이언트가 보낸 id는 절대 신뢰하지 않습니다.
 */
public class AuthInterceptor implements HandlerInterceptor {

    public static final String MEMBER_ID_ATTRIBUTE = "memberId";

    private final SessionManager sessionManager;

    public AuthInterceptor(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = extractToken(request);
        String memberId = token != null ? sessionManager.validateToken(token) : null;

        if (memberId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"인증이 필요합니다.\"}");
            return false;
        }

        request.setAttribute(MEMBER_ID_ATTRIBUTE, Long.valueOf(memberId));
        return true;
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
