package com.portfolio.api.session;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.UUID;

/**
 * Redis 기반 세션 관리자 — 중복 로그인 차단 핵심 컴포넌트
 *
 * Redis 키 구조:
 *   session:user:{userId}  →  {token}   (사용자당 1개)
 *   session:token:{token}  →  {userId}  (토큰당 1개)
 *
 * 중복 로그인 처리 흐름:
 *   1. A 기기에서 로그인 → session:user:admin = tokenA 저장
 *   2. B 기기에서 로그인 시도 → 기존 tokenA 삭제(A 강제 로그아웃) → 새 tokenB 발급
 */
@Component
public class SessionManager {

    private final RedisTemplate<String, String> redisTemplate;

    @Value("${session.ttl-seconds:3600}")
    private long ttlSeconds;

    private static final String USER_KEY_PREFIX  = "session:user:";
    private static final String TOKEN_KEY_PREFIX = "session:token:";

    public SessionManager(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String createSession(String userId) {
        String userKey = USER_KEY_PREFIX + userId;

        String existingToken = redisTemplate.opsForValue().get(userKey);
        if (existingToken != null) {
            redisTemplate.delete(TOKEN_KEY_PREFIX + existingToken);
        }

        String newToken = UUID.randomUUID().toString();
        Duration ttl = Duration.ofSeconds(ttlSeconds);

        redisTemplate.opsForValue().set(userKey, newToken, ttl);
        redisTemplate.opsForValue().set(TOKEN_KEY_PREFIX + newToken, userId, ttl);

        return newToken;
    }

    public String validateToken(String token) {
        return redisTemplate.opsForValue().get(TOKEN_KEY_PREFIX + token);
    }

    public void invalidateSession(String token) {
        String userId = redisTemplate.opsForValue().get(TOKEN_KEY_PREFIX + token);
        if (userId != null) {
            redisTemplate.delete(USER_KEY_PREFIX + userId);
        }
        redisTemplate.delete(TOKEN_KEY_PREFIX + token);
    }

    public void refreshSession(String token) {
        String userId = redisTemplate.opsForValue().get(TOKEN_KEY_PREFIX + token);
        if (userId == null) {
            return;
        }
        Duration ttl = Duration.ofSeconds(ttlSeconds);
        redisTemplate.expire(TOKEN_KEY_PREFIX + token, ttl);
        redisTemplate.expire(USER_KEY_PREFIX + userId, ttl);
    }
}
