package com.portfolio.api.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.api.dto.PortfolioResponse;
import com.portfolio.api.dto.UpdatePortfolioRequest;
import com.portfolio.api.entity.PortfolioOwner;
import com.portfolio.api.repository.PortfolioOwnerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.NoSuchElementException;

@Service
@Transactional(readOnly = true)
public class PortfolioService {

    private static final Logger log = LoggerFactory.getLogger(PortfolioService.class);
    private static final String CACHE_KEY_PREFIX = "portfolio:content:";
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);

    private final PortfolioOwnerRepository ownerRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    public PortfolioService(PortfolioOwnerRepository ownerRepository,
                             RedisTemplate<String, String> redisTemplate,
                             ObjectMapper objectMapper) {
        this.ownerRepository = ownerRepository;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * 공개 조회용 — 방문자가 보는 특정 회원의 포트폴리오. Redis에 JSON 문자열을 캐싱합니다(cache-aside).
     */
    public String getPortfolioJsonByUsername(String username) {
        String cacheKey = CACHE_KEY_PREFIX + username;
        String cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;
        }

        PortfolioOwner owner = ownerRepository.findByMemberUsernameWithAll(username)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다: " + username));

        String json = writeJson(new PortfolioResponse(owner));
        redisTemplate.opsForValue().set(cacheKey, json, CACHE_TTL);
        return json;
    }

    /**
     * 로그인한 회원 본인의 포트폴리오 조회 (관리자 대시보드용).
     */
    public PortfolioResponse getMyPortfolio(Long memberId) {
        PortfolioOwner owner = ownerRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new NoSuchElementException("포트폴리오를 찾을 수 없습니다."));
        return new PortfolioResponse(owner);
    }

    @Transactional
    public PortfolioResponse updateMyPortfolio(Long memberId, UpdatePortfolioRequest request) {
        PortfolioOwner owner = ownerRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new NoSuchElementException("포트폴리오를 찾을 수 없습니다."));

        // 관리 대상 엔티티의 필드만 바꿔서 저장합니다 — skills/projects/careers는 cascade=ALL,
        // orphanRemoval=true이므로 새 PortfolioOwner를 만들어 통째로 save()하면 자식 데이터가 전부 삭제됩니다.
        owner.setTitle(request.title());
        owner.setSubtitle(request.subtitle());
        owner.setEmail(request.email());
        owner.setGithubUrl(request.githubUrl());

        redisTemplate.delete(CACHE_KEY_PREFIX + owner.getMember().getUsername());

        return new PortfolioResponse(owner);
    }

    private String writeJson(PortfolioResponse response) {
        try {
            return objectMapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            log.error("포트폴리오 JSON 직렬화 실패", e);
            throw new IllegalStateException("포트폴리오 데이터를 처리할 수 없습니다.", e);
        }
    }
}
