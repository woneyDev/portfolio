package com.portfolio.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCustomSectionRequest(
        @NotBlank @Size(max = 60) String title,
        @NotBlank @Size(max = 5000) String content
) {
}
