package com.portfolio.api.dto;

import com.portfolio.api.entity.CustomSection;
import com.portfolio.api.entity.PortfolioOwner;
import com.portfolio.api.entity.SectionLayout;

import java.util.Comparator;
import java.util.List;

public class PortfolioResponse {

    private final String username;
    private final HeroDto hero;
    private final List<LayoutDto> layout;
    private final List<CustomSectionDto> customSections;

    public PortfolioResponse(PortfolioOwner owner) {
        this.username = owner.getMember().getUsername();
        this.hero = new HeroDto(owner);
        this.layout = owner.getSectionLayouts().stream()
                .map(LayoutDto::new)
                .sorted(Comparator.comparing(LayoutDto::sectionType))
                .toList();
        this.customSections = owner.getCustomSections().stream()
                .map(CustomSectionDto::new)
                .sorted(Comparator.comparing(CustomSectionDto::id))
                .toList();
    }

    public String getUsername() { return username; }
    public HeroDto getHero() { return hero; }
    public List<LayoutDto> getLayout() { return layout; }
    public List<CustomSectionDto> getCustomSections() { return customSections; }

    public record HeroDto(String title, String subtitle, String email, String githubUrl) {
        public HeroDto(PortfolioOwner o) {
            this(o.getTitle(), o.getSubtitle(), o.getEmail(), o.getGithubUrl());
        }
    }

    public record LayoutDto(String sectionType, int x, int y, int w, int h, boolean visible) {
        public LayoutDto(SectionLayout l) {
            this(l.getSectionType().name(), l.getGridX(), l.getGridY(), l.getGridWidth(), l.getGridHeight(), l.isVisible());
        }
    }

    public record CustomSectionDto(Long id, String title, String content, int x, int y, int w, int h, boolean visible) {
        public CustomSectionDto(CustomSection c) {
            this(c.getId(), c.getTitle(), c.getContent(), c.getGridX(), c.getGridY(), c.getGridWidth(), c.getGridHeight(), c.isVisible());
        }
    }
}
