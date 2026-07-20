-- V7에서 기술스택/프로젝트/경력을 자유 텍스트로 통합했던 것을 되돌린다.
-- 데모 화면(GitHub Pages)과 동일한 태그·카드 디자인을 유지하기 위해, 원래 구조화된
-- skill/project/career 테이블(한 번도 삭제한 적 없음)을 다시 사용하는 방식으로 복귀한다.

-- 1) 모든 회원에게 SKILLS/PROJECTS/CAREER 배치 행을 다시 백필한다 (이미 있으면 건너뜀).
INSERT INTO section_layout (owner_id, section_type, grid_x, grid_y, grid_width, grid_height, visible)
SELECT po.id, 'SKILLS', 0, 2, 12, 2, true
FROM portfolio_owner po
WHERE NOT EXISTS (
    SELECT 1 FROM section_layout sl WHERE sl.owner_id = po.id AND sl.section_type = 'SKILLS'
);

INSERT INTO section_layout (owner_id, section_type, grid_x, grid_y, grid_width, grid_height, visible)
SELECT po.id, 'PROJECTS', 0, 4, 12, 3, true
FROM portfolio_owner po
WHERE NOT EXISTS (
    SELECT 1 FROM section_layout sl WHERE sl.owner_id = po.id AND sl.section_type = 'PROJECTS'
);

INSERT INTO section_layout (owner_id, section_type, grid_x, grid_y, grid_width, grid_height, visible)
SELECT po.id, 'CAREER', 0, 7, 12, 2, true
FROM portfolio_owner po
WHERE NOT EXISTS (
    SELECT 1 FROM section_layout sl WHERE sl.owner_id = po.id AND sl.section_type = 'CAREER'
);

-- 2) 상관님(${member1Username}) 계정에서, V7이 자동으로 만들었던 "기술스택/프로젝트/경력"
--    커스텀 섹션은 이제 구조화된 섹션과 중복되므로 삭제한다. "자기소개"는 원래도 자유
--    텍스트였으므로 그대로 두되, 내용을 운영 서버에 남아있던 실제 글로 채운다.
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

    DELETE FROM custom_section
    WHERE owner_id = v_owner_id AND title IN ('기술스택', '프로젝트', '경력');

    UPDATE custom_section
    SET content =
        '<h3>다양한 프로젝트 경험</h3>' ||
        '<p>신용보증기금 모바일 전자고지 시스템과 신한투자증권 고객통지업무 디지털화 프로젝트를 성공적으로 오픈한 경험이 있습니다. ' ||
        '특히 신한투자증권 프로젝트에서는 팀 리더로서 전체 프로젝트를 이끌며 기획부터 개발까지 전 과정을 주도했습니다. ' ||
        '현업 담당자 및 개발자들과의 원활한 커뮤니케이션을 통해 복잡한 금융권 기간계 데이터를 가공 및 맵핑할 수 있도록 프로그램을 설계하고 구현했습니다. ' ||
        '이후 유지보수팀 팀장으로서 약 20여 개 고객사와의 계약을 기반으로 안정적인 서비스 제공을 이끌며 팀 운영 및 고객관리 역량을 함께 강화해 왔습니다.</p>' ||
        '<h3>조직관리 및 내부 시스템 고도화</h3>' ||
        '<p>신설된 유지보수 팀의 팀장으로 발령된 이후, 고객사별로 상이한 DB 구조와 커스터마이징 요소를 면밀히 파악하고, ' ||
        '두 명의 팀원과 함께 고객사를 효율적으로 분담 관리할 수 있도록 프로세스를 재정립했습니다. ' ||
        '점검일정, 고객 요청사항 등 유지보수 진행 현황을 팀 내에서 실시간으로 공유할 수 있도록 JPA 기반의 자체 관리 시스템을 설계·개발하여 사내망을 통해 운영했으며, ' ||
        '이는 이후 표준 솔루션 모델에도 적용되었습니다.</p>'
    WHERE owner_id = v_owner_id AND title = '자기소개';
END $$;
