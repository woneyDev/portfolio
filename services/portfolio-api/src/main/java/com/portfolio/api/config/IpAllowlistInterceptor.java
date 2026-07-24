package com.portfolio.api.config;

import com.portfolio.api.service.AllowedIpService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Set;

/**
 * 로그인·마이페이지 등 "관리 기능" 요청은 DB에 등록된 IP에서만 통과시킵니다 (관리는 AllowedIpService 담당).
 * 등록되지 않은 IP는 아이디/비밀번호가 맞아도 이 단계에서 먼저 차단됩니다.
 * 로컬 개발(localhost)은 목록 설정과 무관하게 항상 허용해 개발 작업이 막히지 않게 합니다.
 */
public class IpAllowlistInterceptor implements HandlerInterceptor {

    private static final Set<String> ALWAYS_ALLOWED = Set.of("127.0.0.1", "0:0:0:0:0:0:0:1", "::1");

    private final AllowedIpService allowedIpService;

    public IpAllowlistInterceptor(AllowedIpService allowedIpService) {
        this.allowedIpService = allowedIpService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // CORS 사전 확인 요청(OPTIONS)에는 클라이언트가 실제 접속 정보를 담아 보내지 않으므로 통과시킨다.
        // 실제 데이터 요청(GET/POST 등)은 아래 IP 검사를 그대로 통과해야 한다.
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String clientIp = resolveClientIp(request);
        if (ALWAYS_ALLOWED.contains(clientIp) || allowedIpService.isAllowed(clientIp)) {
            return true;
        }

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"error\":\"허용되지 않은 접속 위치입니다.\"}");
        return false;
    }

    // 리버스 프록시(Nginx 등) 뒤에서 실행되는 경우 실제 접속자 IP는 X-Forwarded-For에 담겨 온다.
    // 이 헤더는 우리가 직접 관리하는 프록시를 통해서만 신뢰해야 하며, 그 앞단이 없다면 remoteAddr을 그대로 쓴다.
    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
