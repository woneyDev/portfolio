package com.portfolio.api.dto;

import com.portfolio.api.entity.Career;
import com.portfolio.api.entity.CustomSection;
import com.portfolio.api.entity.PortfolioOwner;
import com.portfolio.api.entity.Project;
import com.portfolio.api.entity.SectionLayout;
import com.portfolio.api.entity.Skill;

import java.util.Comparator;
import java.util.List;

public class PortfolioResponse {

    private final String username;
    private final HeroDto hero;
    private final List<SkillDto> skills;
    private final List<ProjectDto> projects;
    private final List<CareerDto> career;
    private final List<LayoutDto> layout;
    private final List<CustomSectionDto> customSections;

    // lang: "ko" 또는 "en". 영어 번역이 비어있으면 한글 원문으로 자동 대체된다.
    public PortfolioResponse(PortfolioOwner owner, String lang) {
        boolean en = "en".equalsIgnoreCase(lang);
        this.username = owner.getMember().getUsername();
        this.hero = new HeroDto(owner, en);
        this.skills = owner.getSkills().stream().map(s -> new SkillDto(s, en)).toList();
        this.projects = owner.getProjects().stream().map(p -> new ProjectDto(p, en)).toList();
        this.career = owner.getCareers().stream().map(c -> new CareerDto(c, en)).toList();
        this.layout = owner.getSectionLayouts().stream()
                .map(LayoutDto::new)
                .sorted(Comparator.comparing(LayoutDto::sectionType))
                .toList();
        this.customSections = owner.getCustomSections().stream()
                .map(c -> new CustomSectionDto(c, en))
                .sorted(Comparator.comparing(CustomSectionDto::id))
                .toList();
    }

    private static String pick(String ko, String en, boolean useEn) {
        return (useEn && en != null && !en.isBlank()) ? en : ko;
    }

    public String getUsername() { return username; }
    public HeroDto getHero() { return hero; }
    public List<SkillDto> getSkills() { return skills; }
    public List<ProjectDto> getProjects() { return projects; }
    public List<CareerDto> getCareer() { return career; }
    public List<LayoutDto> getLayout() { return layout; }
    public List<CustomSectionDto> getCustomSections() { return customSections; }

    public record HeroDto(String title, String subtitle, String email, String githubUrl) {
        public HeroDto(PortfolioOwner o, boolean en) {
            this(pick(o.getTitle(), o.getTitleEn(), en), pick(o.getSubtitle(), o.getSubtitleEn(), en),
                    o.getEmail(), o.getGithubUrl());
        }
    }

    public record SkillDto(String name, String category) {
        public SkillDto(Skill s, boolean en) {
            this(s.getName(), pick(s.getCategory(), s.getCategoryEn(), en));
        }
    }

    public record ProjectDto(String title, String description, String period, List<String> techStack, boolean hasDemo) {
        public ProjectDto(Project p, boolean en) {
            this(pick(p.getTitle(), p.getTitleEn(), en), pick(p.getDescription(), p.getDescriptionEn(), en),
                    p.getPeriod(), p.getTechStack(), p.isHasDemo());
        }
    }

    public record CareerDto(String company, String role, String period, List<String> achievements) {
        public CareerDto(Career c, boolean en) {
            this(pick(c.getCompany(), c.getCompanyEn(), en), pick(c.getRole(), c.getRoleEn(), en),
                    c.getPeriod(), c.getAchievements().stream().map(a -> pick(a.getText(), a.getTextEn(), en)).toList());
        }
    }

    public record LayoutDto(String sectionType, int x, int y, int w, int h, boolean visible) {
        public LayoutDto(SectionLayout l) {
            this(l.getSectionType().name(), l.getGridX(), l.getGridY(), l.getGridWidth(), l.getGridHeight(), l.isVisible());
        }
    }

    public record CustomSectionDto(Long id, String slug, String title, String content, int x, int y, int w, int h, boolean visible) {
        public CustomSectionDto(CustomSection c, boolean en) {
            this(c.getId(), c.getSlug(), pick(c.getTitle(), c.getTitleEn(), en), pick(c.getContent(), c.getContentEn(), en),
                    c.getGridX(), c.getGridY(), c.getGridWidth(), c.getGridHeight(), c.isVisible());
        }
    }
}
