package com.portfolio.api.dto;

import com.portfolio.api.entity.AllowedIp;

import java.time.Instant;

public record AllowedIpResponse(Long id, String ipAddress, String memo, Instant createdAt) {

    public static AllowedIpResponse from(AllowedIp entity) {
        return new AllowedIpResponse(entity.getId(), entity.getIpAddress(), entity.getMemo(), entity.getCreatedAt());
    }
}
