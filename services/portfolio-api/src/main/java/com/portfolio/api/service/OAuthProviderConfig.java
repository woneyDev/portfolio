package com.portfolio.api.service;

public record OAuthProviderConfig(
        String authorizeUrl,
        String tokenUrl,
        String userInfoUrl,
        String clientId,
        String clientSecret,
        String redirectUri,
        String scope
) {
}
