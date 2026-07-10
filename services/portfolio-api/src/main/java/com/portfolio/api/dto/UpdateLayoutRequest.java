package com.portfolio.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.List;

public record UpdateLayoutRequest(
        @NotEmpty List<@Valid Item> sections,
        List<@Valid CustomItem> customSections
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

    public record CustomItem(
            @NotNull Long id,
            @PositiveOrZero int x,
            @PositiveOrZero int y,
            @PositiveOrZero int w,
            @PositiveOrZero int h,
            boolean visible
    ) {
    }
}
