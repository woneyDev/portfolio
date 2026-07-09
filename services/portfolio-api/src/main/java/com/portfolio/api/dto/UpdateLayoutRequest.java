package com.portfolio.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.List;

public record UpdateLayoutRequest(
        @NotEmpty List<@Valid Item> sections
) {
    public record Item(
            @NotBlank String sectionType,
            @PositiveOrZero int x,
            @PositiveOrZero int y,
            @PositiveOrZero int w,
            @PositiveOrZero int h,
            boolean visible
    ) {
    }
}
