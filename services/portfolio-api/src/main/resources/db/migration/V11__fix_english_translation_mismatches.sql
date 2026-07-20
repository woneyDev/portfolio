-- V10에서 영어 번역문을 손으로 옮겨적으면서 데모 화면(portfolio.en.json) 원문과 몇 군데 미묘하게
-- 달라진 부분이 있었다. 원본 파일 내용을 그대로(재입력 없이) 다시 채워 정확히 일치시킨다.
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

    UPDATE project SET
        title_en = 'Shinhan Investment Corp. – Customer Notification Digitalization',
        description_en = 'Built a system to process and map tens of thousands of records of core brokerage data. As project lead, I defined the data structure and formatting rules, wrote the screen design specs, oversaw both front-end and back-end development, and built a PDF generation system using Clipreport.'
    WHERE owner_id = v_owner_id AND title = '신한투자증권 고객통지업무 디지털화';

    UPDATE project SET
        title_en = '4Depth – Structuring the Maintenance Team',
        description_en = 'As lead of the newly formed maintenance team, I analyzed each client system''s characteristics and complexity to build a role-sharing structure with two teammates. I studied JPA and QueryDSL together with the team, introduced Git and code review practices, and secured numerous maintenance contract renewals.'
    WHERE owner_id = v_owner_id AND title = '포뎁스 유지보수팀 체계화';

    UPDATE career SET company_en = 'Beborndays', role_en = 'Business Support'
    WHERE owner_id = v_owner_id AND company = '비본데이즈' AND role = '경영지원';

    UPDATE career_achievement ca SET achievement_en = 'Led the Shinhan Investment Corp. customer notification digitalization project (designed and built financial data processing and large-scale dispatch systems)'
    FROM career c WHERE c.id = ca.career_id AND c.owner_id = v_owner_id
      AND ca.achievement = '신한투자증권 고객통지업무 디지털화 프로젝트 리더 (금융 데이터 가공 및 대규모 발송 시스템 설계·개발)';

    UPDATE career_achievement ca SET achievement_en = 'Contributed to the Korea Credit Guarantee Fund mobile e-notification project (front-end development, helped cut the project timeline by 50%)'
    FROM career c WHERE c.id = ca.career_id AND c.owner_id = v_owner_id
      AND ca.achievement = '신용보증기금 모바일 전자고지 프로젝트 참여 (Frontend 개발, 프로젝트 기간 50% 단축 기여)';

    UPDATE career_achievement ca SET achievement_en = 'Performed business support operations'
    FROM career c WHERE c.id = ca.career_id AND c.owner_id = v_owner_id
      AND ca.achievement = '경영지원 업무 수행';
END $$;
