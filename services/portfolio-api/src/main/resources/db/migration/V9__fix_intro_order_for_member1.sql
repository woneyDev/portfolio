-- "자기소개"가 우연히 기술스택과 같은 y좌표(2)에 놓여 있어 순서가 데모 화면과 어긋나 있었다.
-- 데모 화면과 동일한 순서(인트로 배너 → 자기소개 → 기술스택 → 프로젝트 → 경력)로 상관님
-- (${member1Username}) 계정만 바로잡는다. 다른 회원에게는 영향 없음(이 커스텀 섹션 자체가 없음).
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

    UPDATE custom_section SET grid_y = 2, grid_height = 3
    WHERE owner_id = v_owner_id AND title = '자기소개';

    UPDATE section_layout SET grid_y = 5 WHERE owner_id = v_owner_id AND section_type = 'SKILLS';
    UPDATE section_layout SET grid_y = 7 WHERE owner_id = v_owner_id AND section_type = 'PROJECTS';
    UPDATE section_layout SET grid_y = 10 WHERE owner_id = v_owner_id AND section_type = 'CAREER';
END $$;
