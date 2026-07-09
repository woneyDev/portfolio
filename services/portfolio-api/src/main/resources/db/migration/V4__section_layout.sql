CREATE TABLE section_layout (
    id           BIGSERIAL PRIMARY KEY,
    owner_id     BIGINT      NOT NULL,
    section_type VARCHAR(20) NOT NULL,
    grid_x       INT         NOT NULL,
    grid_y       INT         NOT NULL,
    grid_width   INT         NOT NULL,
    grid_height  INT         NOT NULL,
    visible      BOOLEAN     NOT NULL DEFAULT true,
    CONSTRAINT fk_section_layout_owner FOREIGN KEY (owner_id) REFERENCES portfolio_owner(id),
    CONSTRAINT uq_section_layout_owner_type UNIQUE (owner_id, section_type)
);

CREATE INDEX idx_section_layout_owner_id ON section_layout(owner_id);

-- 기존 회원들에게 기본 배치(세로 1열: 자기소개 → 스킬 → 프로젝트 → 경력사항, 전부 표시)를 백필한다.
INSERT INTO section_layout (owner_id, section_type, grid_x, grid_y, grid_width, grid_height, visible)
SELECT id, 'HERO', 0, 0, 4, 2, true FROM portfolio_owner
UNION ALL
SELECT id, 'SKILLS', 0, 2, 4, 2, true FROM portfolio_owner
UNION ALL
SELECT id, 'PROJECTS', 0, 4, 4, 3, true FROM portfolio_owner
UNION ALL
SELECT id, 'CAREER', 0, 7, 4, 2, true FROM portfolio_owner;
