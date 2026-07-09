package com.portfolio.api.dto;

import com.portfolio.api.entity.Career;
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

    public PortfolioResponse(PortfolioOwner owner) {
        this.username = owner.getMember().getUsername();
        this.hero = new HeroDto(owner);
        this.skills = owner.getSkills().stream().map(SkillDto::new).toList();
        this.projects = owner.getProjects().stream().map(ProjectDto::new).toList();
        this.career = owner.getCareers().stream().map(CareerDto::new).toList();
        this.layout = owner.getSectionLayouts().stream()
                .map(LayoutDto::new)
                .sorted(Comparator.comparing(LayoutDto::sectionType))
                .toList();
    }

    public String getUsername() { return username; }
    public HeroDto getHero() { return hero; }
    public List<SkillDto> getSkills() { return skills; }
    public List<ProjectDto> getProjects() { return projects; }
    public List<CareerDto> getCareer() { return career; }
    public List<LayoutDto> getLayout() { return layout; }

    public record HeroDto(String title, String subtitle, String email, String githubUrl) {
        public HeroDto(PortfolioOwner o) {
            this(o.getTitle(), o.getSubtitle(), o.getEmail(), o.getGithubUrl());
        }
    }

    public record SkillDto(String name, String category) {
        public SkillDto(Skill s) {
            this(s.getName(), s.getCategory());
        }
    }

    public record ProjectDto(String title, String description, String period, List<String> techStack, boolean hasDemo) {
        public ProjectDto(Project p) {
            this(p.getTitle(), p.getDescription(), p.getPeriod(), p.getTechStack(), p.isHasDemo());
        }
    }

    public record CareerDto(String company, String role, String period, List<String> achievements) {
        public CareerDto(Career c) {
            this(c.getCompany(), c.getRole(), c.getPeriod(), c.getAchievements());
        }
    }

    public record LayoutDto(String sectionType, int x, int y, int w, int h, boolean visible) {
        public LayoutDto(SectionLayout l) {
            this(l.getSectionType().name(), l.getGridX(), l.getGridY(), l.getGridWidth(), l.getGridHeight(), l.isVisible());
        }
    }
}
