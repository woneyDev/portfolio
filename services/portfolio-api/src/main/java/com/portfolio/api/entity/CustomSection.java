package com.portfolio.api.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "custom_section")
public class CustomSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String title;

    @Column(name = "title_en", length = 60)
    private String titleEn;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "content_en", columnDefinition = "TEXT")
    private String contentEn;

    // 언어에 따라 제목이 바뀌어도 화면이 "이 섹션이 자기소개다" 같은 특수 처리를 알아볼 수 있도록 하는
    // 언어 독립적인 표식. 지금은 "intro" 하나만 쓰이고, 일반 커스텀 섹션은 null이다.
    @Column(length = 30)
    private String slug;

    @Column(name = "grid_x", nullable = false)
    private int gridX;

    @Column(name = "grid_y", nullable = false)
    private int gridY;

    @Column(name = "grid_width", nullable = false)
    private int gridWidth;

    @Column(name = "grid_height", nullable = false)
    private int gridHeight;

    @Column(nullable = false)
    private boolean visible = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private PortfolioOwner owner;

    public CustomSection() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getContentEn() { return contentEn; }
    public void setContentEn(String contentEn) { this.contentEn = contentEn; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public int getGridX() { return gridX; }
    public void setGridX(int gridX) { this.gridX = gridX; }

    public int getGridY() { return gridY; }
    public void setGridY(int gridY) { this.gridY = gridY; }

    public int getGridWidth() { return gridWidth; }
    public void setGridWidth(int gridWidth) { this.gridWidth = gridWidth; }

    public int getGridHeight() { return gridHeight; }
    public void setGridHeight(int gridHeight) { this.gridHeight = gridHeight; }

    public boolean isVisible() { return visible; }
    public void setVisible(boolean visible) { this.visible = visible; }

    public PortfolioOwner getOwner() { return owner; }
    public void setOwner(PortfolioOwner owner) { this.owner = owner; }
}
