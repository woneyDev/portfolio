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
        // 브라우저가 크로스 오리진(다른 포트/도메인) 요청 전에 자동으로 보내는 "사전 확인 요청(CORS Preflight)"이다.
        // 이 요청에는 브라우저가 의도적으로 Authorization 헤더를 싣지 않으므로, 아래의 로그인 검사를 절대 통과할 수 없다.
        // 여기서 막아버리면 브라우저는 "서버가 허락하지 않았다"고 판단해 뒤따르는 진짜 요청(로그인 토큰 포함)을 아예 보내지 않는다.
        // 그래서 이 사전 확인 요청만 별도로 통과시킨다 — 실제 데이터 요청(GET/POST/PUT 등)은 아래 로직으로 여전히 검사된다.
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

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
