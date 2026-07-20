-- 화면 콘텐츠에 영어 버전을 나란히 저장할 수 있도록 칼럼을 추가한다.
-- (한글 원본은 그대로 두고, 영어 칼럼은 비워둬도 되는 선택 항목 — 채워지지 않으면 한글로 대체 표시된다)

ALTER TABLE portfolio_owner ADD COLUMN title_en TEXT;
ALTER TABLE portfolio_owner ADD COLUMN subtitle_en TEXT;

ALTER TABLE skill ADD COLUMN category_en VARCHAR(255);

ALTER TABLE project ADD COLUMN title_en VARCHAR(255);
ALTER TABLE project ADD COLUMN description_en VARCHAR(1000);

ALTER TABLE career ADD COLUMN company_en VARCHAR(255);
ALTER TABLE career ADD COLUMN role_en VARCHAR(255);

ALTER TABLE career_achievement ADD COLUMN achievement_en VARCHAR(500);

ALTER TABLE custom_section ADD COLUMN title_en VARCHAR(60);
ALTER TABLE custom_section ADD COLUMN content_en TEXT;
ALTER TABLE custom_section ADD COLUMN slug VARCHAR(30);

-- 상관님(${member1Username}) 계정에 한해, 이미 GitHub Pages 데모(portfolio.en.json)에 준비되어 있던
-- 영어 번역문을 그대로 옮겨 채운다. 다른 회원은 영어 칼럼이 비어있는 채로 시작한다.
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

    UPDATE portfolio_owner SET
        title_en = 'Hi, I''m Wonhee Ryu — a developer aiming to become an irreplaceable specialist.',
        subtitle_en = 'From processing core financial-sector data to running a maintenance organization, I build reliable systems drawing on end-to-end experience — from planning through development.'
    WHERE id = v_owner_id;

    UPDATE skill SET category_en = 'Tech Stack Behind This Portfolio'
    WHERE owner_id = v_owner_id AND category = '이 포트폴리오 프로젝트에 사용된 기술';

    UPDATE project SET
        title_en = 'Korea Credit Guarantee Fund – Mobile e-Notification',
        description_en = 'A mobile e-notification system that delivers messages to customers in real time at scheduled send times, replacing paper mail. Worked with in-house developers to establish the core data-processing workflow and built roughly 200 JSP front-end screens.'
    WHERE owner_id = v_owner_id AND title = '신용보증기금 모바일 전자고지';

    UPDATE project SET
        title_en = 'Shinhan Investment Corp. – Customer Notification Digital Transformation',
        description_en = 'Built a system to process and map tens of thousands of core financial-sector records for a securities firm. As project lead, established data structure and formatting rules, wrote screen specs, oversaw both frontend and backend development, and built a PDF-generation pipeline using Clipreport.'
    WHERE owner_id = v_owner_id AND title = '신한투자증권 고객통지업무 디지털화';

    UPDATE project SET
        title_en = '4Depth – Systematizing the Maintenance Team',
        description_en = 'As lead of a newly formed maintenance team, analyzed each client''s system characteristics and complexity to divide responsibilities with two teammates. Studied JPA and QueryDSL together with the team, introduced Git and code review, and drove numerous maintenance contract renewals.'
    WHERE owner_id = v_owner_id AND title = '포뎁스 유지보수팀 체계화';

    UPDATE career SET
        company_en = '4Depth', role_en = 'Maintenance Team Lead'
    WHERE owner_id = v_owner_id AND company = '포뎁스' AND role = '유지보수팀 팀장';

    UPDATE career SET
        company_en = '4Depth', role_en = 'IT Business Division 1, Team 1'
    WHERE owner_id = v_owner_id AND company = '포뎁스' AND role = 'IT사업1부 1팀';

    UPDATE career SET
        company_en = 'VivonDays', role_en = 'Business Support'
    WHERE owner_id = v_owner_id AND company = '비본데이즈' AND role = '경영지원';

    UPDATE career_achievement ca SET achievement_en = 'Oversaw operations for about 20 client companies and built an in-house maintenance management system'
    FROM career c WHERE c.id = ca.career_id AND c.owner_id = v_owner_id
      AND ca.achievement = '20여 개 고객사 운영 총괄 및 유지보수 관리 시스템 자체 개발';

    UPDATE career_achievement ca SET achievement_en = 'Drove client-requested improvements and additional development for maintenance accounts'
    FROM career c WHERE c.id = ca.career_id AND c.owner_id = v_owner_id
      AND ca.achievement = '유지보수 고객사 개선 및 추가 개발 진행';

    UPDATE career_achievement ca SET achievement_en = 'Led the Shinhan Investment Corp. customer notification digital transformation project (designed and built financial data processing and large-scale dispatch systems)'
    FROM career c WHERE c.id = ca.career_id AND c.owner_id = v_owner_id
      AND ca.achievement = '신한투자증권 고객통지업무 디지털화 프로젝트 리더 (금융 데이터 가공 및 대규모 발송 시스템 설계·개발)';

    UPDATE career_achievement ca SET achievement_en = 'Participated in the Korea Credit Guarantee Fund mobile e-notification project (frontend development, contributed to a 50% project timeline reduction)'
    FROM career c WHERE c.id = ca.career_id AND c.owner_id = v_owner_id
      AND ca.achievement = '신용보증기금 모바일 전자고지 프로젝트 참여 (Frontend 개발, 프로젝트 기간 50% 단축 기여)';

    UPDATE career_achievement ca SET achievement_en = 'Handled general business support duties'
    FROM career c WHERE c.id = ca.career_id AND c.owner_id = v_owner_id
      AND ca.achievement = '경영지원 업무 수행';

    UPDATE custom_section SET
        slug = 'intro',
        title_en = 'About Me',
        content_en =
            '<h3>Diverse Project Experience</h3>' ||
            '<p>I successfully launched the Korea Credit Guarantee Fund''s mobile e-notification system and led the digital transformation of Shinhan Investment Corp.''s customer notification operations. ' ||
            'As team lead on the Shinhan Investment project, I drove the entire process end-to-end, from planning through development. ' ||
            'Through close communication with business stakeholders and developers, I designed and built programs to process and map complex core financial data. ' ||
            'Later, as head of the maintenance team, I managed contracts with roughly 20 client companies, delivering stable service while strengthening both team operations and client management.</p>' ||
            '<h3>Organizational Management &amp; Internal System Improvements</h3>' ||
            '<p>After being appointed lead of the newly formed maintenance team, I closely studied each client''s distinct database structure and customizations, and restructured our workflow so two team members could efficiently share client responsibilities. ' ||
            'I designed and built an in-house, JPA-based management system to share maintenance status — inspection schedules, client requests, and more — across the team in real time, running it on our internal network. ' ||
            'This system later became the basis for a standardized solution model.</p>'
    WHERE owner_id = v_owner_id AND title = '자기소개';
END $$;
