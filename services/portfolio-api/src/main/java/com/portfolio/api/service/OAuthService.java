package com.portfolio.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.api.entity.Member;
import com.portfolio.api.entity.OAuthIdentity;
import com.portfolio.api.repository.OAuthIdentityRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
public class OAuthService {

    private static final String STATE_KEY_PREFIX = "oauth:state:";
    private static final Duration STATE_TTL = Duration.ofMinutes(5);

    private final Map<String, OAuthProviderConfig> providers;
    private final RedisTemplate<String, String> redisTemplate;
    private final OAuthIdentityRepository oauthIdentityRepository;
    private final MemberService memberService;
    private final RestClient restClient = RestClient.create();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public OAuthService(
            RedisTemplate<String, String> redisTemplate,
            OAuthIdentityRepository oauthIdentityRepository,
            MemberService memberService,
            @Value("${oauth.google.client-id:}") String googleClientId,
            @Value("${oauth.google.client-secret:}") String googleClientSecret,
            @Value("${oauth.google.redirect-uri:http://localhost:8081/api/auth/oauth/google/callback}") String googleRedirectUri,
            @Value("${oauth.kakao.client-id:}") String kakaoClientId,
            @Value("${oauth.kakao.client-secret:}") String kakaoClientSecret,
            @Value("${oauth.kakao.redirect-uri:http://localhost:8081/api/auth/oauth/kakao/callback}") String kakaoRedirectUri,
            @Value("${oauth.naver.client-id:}") String naverClientId,
            @Value("${oauth.naver.client-secret:}") String naverClientSecret,
            @Value("${oauth.naver.redirect-uri:http://localhost:8081/api/auth/oauth/naver/callback}") String naverRedirectUri
    ) {
        this.redisTemplate = redisTemplate;
        this.oauthIdentityRepository = oauthIdentityRepository;
        this.memberService = memberService;

        this.providers = Map.of(
                "google", new OAuthProviderConfig(
                        "https://accounts.google.com/o/oauth2/v2/auth",
                        "https://oauth2.googleapis.com/token",
                        "https://openidconnect.googleapis.com/v1/userinfo",
                        googleClientId, googleClientSecret, googleRedirectUri, "openid email"),
                "kakao", new OAuthProviderConfig(
                        "https://kauth.kakao.com/oauth/authorize",
                        "https://kauth.kakao.com/oauth/token",
                        "https://kapi.kakao.com/v2/user/me",
                        kakaoClientId, kakaoClientSecret, kakaoRedirectUri, "account_email"),
                "naver", new OAuthProviderConfig(
                        "https://nid.naver.com/oauth2.0/authorize",
                        "https://nid.naver.com/oauth2.0/token",
                        "https://openapi.naver.com/v1/nid/me",
                        naverClientId, naverClientSecret, naverRedirectUri, "")
        );
    }

    public boolean isKnownProvider(String provider) {
        return providers.containsKey(provider);
    }

    public String buildAuthorizeUrl(String provider) {
        OAuthProviderConfig config = requireConfig(provider);
        String state = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set(STATE_KEY_PREFIX + state, provider, STATE_TTL);

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(config.authorizeUrl())
                .queryParam("client_id", config.clientId())
                .queryParam("redirect_uri", config.redirectUri())
                .queryParam("response_type", "code")
                .queryParam("state", state);

        if (!config.scope().isBlank()) {
            builder.queryParam("scope", config.scope());
        }
        return builder.build().encode().toUriString();
    }

    @Transactional
    public Member handleCallback(String provider, String code, String state) {
        String storedProvider = redisTemplate.opsForValue().get(STATE_KEY_PREFIX + state);
        if (storedProvider == null || !storedProvider.equals(provider)) {
            throw new InvalidOAuthStateException();
        }
        redisTemplate.delete(STATE_KEY_PREFIX + state);

        OAuthProviderConfig config = requireConfig(provider);
        String accessToken = exchangeCodeForToken(config, code);
        OAuthUserInfo userInfo = fetchUserInfo(provider, config, accessToken);

        return oauthIdentityRepository.findByProviderAndProviderUserId(provider, userInfo.providerUserId())
                .map(OAuthIdentity::getMember)
                .orElseGet(() -> linkOrCreateMember(provider, userInfo));
    }

    private Member linkOrCreateMember(String provider, OAuthUserInfo userInfo) {
        Member member = memberService.findOrCreateForOAuth(userInfo.email());

        OAuthIdentity identity = new OAuthIdentity();
        identity.setMember(member);
        identity.setProvider(provider);
        identity.setProviderUserId(userInfo.providerUserId());
        identity.setCreatedAt(Instant.now());
        oauthIdentityRepository.save(identity);

        return member;
    }

    private String exchangeCodeForToken(OAuthProviderConfig config, String code) {
        String form = "grant_type=authorization_code"
                + "&client_id=" + encode(config.clientId())
                + "&client_secret=" + encode(config.clientSecret())
                + "&redirect_uri=" + encode(config.redirectUri())
                + "&code=" + encode(code);

        String body = restClient.post()
                .uri(config.tokenUrl())
                .header("Content-Type", "application/x-www-form-urlencoded")
                .body(form)
                .retrieve()
                .body(String.class);

        JsonNode json = readTree(body);
        return json.path("access_token").asText();
    }

    private OAuthUserInfo fetchUserInfo(String provider, OAuthProviderConfig config, String accessToken) {
        String body = restClient.get()
                .uri(config.userInfoUrl())
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(String.class);

        JsonNode json = readTree(body);

        return switch (provider) {
            case "google" -> new OAuthUserInfo(json.path("sub").asText(), json.path("email").asText());
            case "kakao" -> new OAuthUserInfo(
                    json.path("id").asText(),
                    json.path("kakao_account").path("email").asText());
            case "naver" -> new OAuthUserInfo(
                    json.path("response").path("id").asText(),
                    json.path("response").path("email").asText());
            default -> throw new IllegalArgumentException("지원하지 않는 로그인 제공자입니다: " + provider);
        };
    }

    private JsonNode readTree(String body) {
        try {
            return objectMapper.readTree(body);
        } catch (Exception e) {
            throw new IllegalStateException("로그인 제공자 응답을 처리할 수 없습니다.", e);
        }
    }

    private String encode(String value) {
        return java.net.URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
    }

    private OAuthProviderConfig requireConfig(String provider) {
        OAuthProviderConfig config = providers.get(provider);
        if (config == null) {
            throw new IllegalArgumentException("지원하지 않는 로그인 제공자입니다: " + provider);
        }
        return config;
    }
}
