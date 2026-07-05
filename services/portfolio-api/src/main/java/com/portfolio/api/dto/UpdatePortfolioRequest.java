package com.portfolio.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdatePortfolioRequest(
        @NotBlank String title,
        @NotBlank @Size(max = 500) String subtitle,
        @NotBlank String email,
        @NotBlank String githubUrl
) {
}
