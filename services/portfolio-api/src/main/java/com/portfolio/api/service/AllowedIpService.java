package com.portfolio.api.service;

import com.portfolio.api.entity.AllowedIp;
import com.portfolio.api.repository.AllowedIpRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

/**
 * 로그인·마이페이지 접속을 허용할 IP 목록을 DB에서 관리한다 (기존 .env 고정값 방식 대체).
 * 매 요청마다 DB를 직접 조회하면 느려지므로, 짧은 시간 Redis에 캐싱해서 조회하고
 * 목록이 추가/삭제될 때는 캐시를 즉시 비워 바로 반영되게 한다.
 */
@Service
@Transactional(readOnly = true)
public class AllowedIpService {

    private static final String CACHE_KEY = "admin:allowed-ips";
    private static final Duration CACHE_TTL = Duration.ofSeconds(30);
    private static final Pattern IPV4_PATTERN =
            Pattern.compile("^(25[0-5]|2[0-4]\\d|1?\\d{1,2})(\\.(25[0-5]|2[0-4]\\d|1?\\d{1,2})){3}$");
    private static final Pattern IPV6_PATTERN = Pattern.compile("^[0-9a-fA-F:]+$");

    private final AllowedIpRepository allowedIpRepository;
    private final RedisTemplate<String, String> redisTemplate;

    public AllowedIpService(AllowedIpRepository allowedIpRepository, RedisTemplate<String, String> redisTemplate) {
        this.allowedIpRepository = allowedIpRepository;
        this.redisTemplate = redisTemplate;
    }

    public List<AllowedIp> list() {
        return allowedIpRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Transactional
    public AllowedIp add(String ipAddress, String memo) {
        String normalized = ipAddress.trim();
        if (!isValidIp(normalized)) {
            throw new InvalidIpAddressException("올바른 IP 주소 형식이 아닙니다: " + normalized);
        }
        if (allowedIpRepository.existsByIpAddress(normalized)) {
            throw new DuplicateFieldException("이미 등록된 IP 주소입니다: " + normalized);
        }
        AllowedIp saved = allowedIpRepository.save(new AllowedIp(normalized, memo));
        invalidateCache();
        return saved;
    }

    @Transactional
    public void remove(Long id) {
        allowedIpRepository.deleteById(id);
        invalidateCache();
    }

    public boolean isAllowed(String ip) {
        String cached = redisTemplate.opsForValue().get(CACHE_KEY);
        if (cached == null) {
            cached = reloadCache();
        }
        if (cached.isEmpty()) return false;
        return Arrays.asList(cached.split(",")).contains(ip);
    }

    private String reloadCache() {
        String joined = String.join(",",
                allowedIpRepository.findAll().stream().map(AllowedIp::getIpAddress).toList());
        redisTemplate.opsForValue().set(CACHE_KEY, joined, CACHE_TTL);
        return joined;
    }

    private void invalidateCache() {
        redisTemplate.delete(CACHE_KEY);
    }

    private boolean isValidIp(String ip) {
        return IPV4_PATTERN.matcher(ip).matches()
                || (ip.contains(":") && IPV6_PATTERN.matcher(ip).matches());
    }
}
