-- 회원이 제목+내용을 직접 써서 자유롭게 추가하는 섹션(예: "수상 내역", "취미" 등).
-- 기존 4개 고정 섹션(section_layout)과 달리 종류가 정해져 있지 않고 개수 제한도 없다.
CREATE TABLE custom_section (
    id          BIGSERIAL PRIMARY KEY,
    owner_id    BIGINT       NOT NULL,
    title       VARCHAR(60)  NOT NULL,
    content     TEXT         NOT NULL,
    grid_x      INT          NOT NULL,
    grid_y      INT          NOT NULL,
    grid_width  INT          NOT NULL,
    grid_height INT          NOT NULL,
    visible     BOOLEAN      NOT NULL DEFAULT true,
    CONSTRAINT fk_custom_section_owner FOREIGN KEY (owner_id) REFERENCES portfolio_owner(id)
);

CREATE INDEX idx_custom_section_owner_id ON custom_section(owner_id);
