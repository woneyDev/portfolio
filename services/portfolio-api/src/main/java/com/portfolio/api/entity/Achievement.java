package com.portfolio.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

// 경력 성과 한 줄 — 한글 원문 + (선택) 영문 번역본.
@Embeddable
public class Achievement {

    @Column(name = "achievement", length = 500)
    private String text;

    @Column(name = "achievement_en", length = 500)
    private String textEn;

    public Achievement() {}

    public Achievement(String text, String textEn) {
        this.text = text;
        this.textEn = textEn;
    }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getTextEn() { return textEn; }
    public void setTextEn(String textEn) { this.textEn = textEn; }
}
