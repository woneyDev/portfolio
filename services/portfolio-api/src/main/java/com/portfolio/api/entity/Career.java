package com.portfolio.api.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "career")
public class Career {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String company;

    @Column(name = "company_en")
    private String companyEn;

    @Column(nullable = false)
    private String role;

    @Column(name = "role_en")
    private String roleEn;

    @Column(nullable = false)
    private String period;

    @ElementCollection
    @CollectionTable(name = "career_achievement", joinColumns = @JoinColumn(name = "career_id"))
    private List<Achievement> achievements = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private PortfolioOwner owner;

    public Career() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getCompanyEn() { return companyEn; }
    public void setCompanyEn(String companyEn) { this.companyEn = companyEn; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getRoleEn() { return roleEn; }
    public void setRoleEn(String roleEn) { this.roleEn = roleEn; }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public List<Achievement> getAchievements() { return achievements; }
    public void setAchievements(List<Achievement> achievements) { this.achievements = achievements; }

    public PortfolioOwner getOwner() { return owner; }
    public void setOwner(PortfolioOwner owner) { this.owner = owner; }
}
