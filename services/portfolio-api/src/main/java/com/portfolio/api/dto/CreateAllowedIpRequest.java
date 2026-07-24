package com.portfolio.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateAllowedIpRequest(
        @NotBlank @Size(max = 45)
        String ipAddress,

        @Size(max = 100, message = "메모는 100자 이하로 입력해주세요.")
        String memo
) {
}
