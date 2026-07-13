-- 자기소개/기술스택/프로젝트/경력을 고정 섹션(section_layout)에서 자유 텍스트 커스텀 섹션(custom_section)으로 전환한다.
-- 인트로 배너(HERO)만 유일한 고정 섹션으로 남는다.

-- 1) 이제 더 이상 쓰이지 않는 섹션 종류의 배치 행을 정리한다 (모든 회원 공통).
DELETE FROM section_layout WHERE section_type IN ('SKILLS', 'PROJECTS', 'CAREER');

-- 2) 상관님(${member1Username}) 계정에 한해서만, 기존에 입력해둔 스킬·프로젝트·경력 데이터를
--    사라지지 않도록 보기 좋은 글(HTML)로 정리해서 커스텀 섹션으로 옮긴다.
--    다른(신규) 회원에게는 이 이관이 적용되지 않는다 — 그들은 인트로 이후를 빈 상태로 시작한다.
--    skill/project/career 원본 테이블 자체는 안전을 위해 삭제하지 않고 그대로 남겨둔다(더 이상 애플리케이션에서 참조하지 않음).

DO $$
DECLARE
    v_owner_id BIGINT;
BEGIN
    SELECT po.id INTO v_owner_id
    FROM portfolio_owner po
    JOIN member m ON m.id = po.member_id
    WHERE m.username = '${member1Username}';

    IF v_owner_id IS NULL THEN
        RETURN;
    END IF;

    -- 빈 "자기소개" 섹션 (기존에 마이그레이션된 데이터가 없으므로 새로 작성하도록 빈 채로 만들어둔다)
    INSERT INTO custom_section (owner_id, title, content, grid_x, grid_y, grid_width, grid_height, visible)
    VALUES (v_owner_id, '자기소개', '', 0, 2, 12, 2, true);

    -- 기술스택: 카테고리별로 묶어서 문단으로 정리
    INSERT INTO custom_section (owner_id, title, content, grid_x, grid_y, grid_width, grid_height, visible)
    SELECT v_owner_id, '기술스택', COALESCE(string_agg(para, ''), ''), 0, 4, 12, 2, true
    FROM (
        SELECT '<p><strong>' ||
               replace(replace(replace(category, '&', '&amp;'), '<', '&lt;'), '>', '&gt;') ||
               '</strong> — ' ||
               string_agg(
                   replace(replace(replace(name, '&', '&amp;'), '<', '&lt;'), '>', '&gt;'),
                   ', ' ORDER BY id
               ) || '</p>' AS para
        FROM skill
        WHERE owner_id = v_owner_id
        GROUP BY category
        ORDER BY category
    ) grouped;

    -- 프로젝트: 제목/기간/설명/기술스택을 프로젝트별 문단으로 정리
    INSERT INTO custom_section (owner_id, title, content, grid_x, grid_y, grid_width, grid_height, visible)
    SELECT v_owner_id, '프로젝트', COALESCE(string_agg(para, '' ORDER BY proj_id), ''), 0, 6, 12, 3, true
    FROM (
        SELECT p.id AS proj_id,
               '<h3>' || replace(replace(replace(p.title, '&', '&amp;'), '<', '&lt;'), '>', '&gt;') || '</h3>' ||
               '<p><em>' || replace(replace(replace(p.period, '&', '&amp;'), '<', '&lt;'), '>', '&gt;') || '</em></p>' ||
               '<p>' || replace(replace(replace(p.description, '&', '&amp;'), '<', '&lt;'), '>', '&gt;') || '</p>' ||
               CASE WHEN tech.tech_text IS NOT NULL
                    THEN '<p><strong>기술스택:</strong> ' || tech.tech_text || '</p>'
                    ELSE '' END AS para
        FROM project p
        LEFT JOIN (
            SELECT project_id, string_agg(replace(replace(replace(tech, '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), ', ' ORDER BY tech) AS tech_text
            FROM project_tech_stack
            GROUP BY project_id
        ) tech ON tech.project_id = p.id
        WHERE p.owner_id = v_owner_id
    ) proj;

    -- 경력: 회사·직책·기간·성과를 경력별 문단으로 정리
    INSERT INTO custom_section (owner_id, title, content, grid_x, grid_y, grid_width, grid_height, visible)
    SELECT v_owner_id, '경력', COALESCE(string_agg(para, '' ORDER BY car_id), ''), 0, 9, 12, 2, true
    FROM (
        SELECT c.id AS car_id,
               '<h3>' || replace(replace(replace(c.company, '&', '&amp;'), '<', '&lt;'), '>', '&gt;') ||
               ' · ' || replace(replace(replace(c.role, '&', '&amp;'), '<', '&lt;'), '>', '&gt;') || '</h3>' ||
               '<p><em>' || replace(replace(replace(c.period, '&', '&amp;'), '<', '&lt;'), '>', '&gt;') || '</em></p>' ||
               COALESCE('<ul>' || ach.ach_html || '</ul>', '') AS para
        FROM career c
        LEFT JOIN (
            SELECT career_id, string_agg('<li>' || replace(replace(replace(achievement, '&', '&amp;'), '<', '&lt;'), '>', '&gt;') || '</li>', '' ORDER BY achievement) AS ach_html
            FROM career_achievement
            GROUP BY career_id
        ) ach ON ach.career_id = c.id
        WHERE c.owner_id = v_owner_id
    ) car;
END $$;
