-- 회원가입 화면에 "닉네임"(자유, 중복허용)과 "소속"(구직자/현직 개발자/인사담당자 등) 항목을 새로 받기 위한 칸 추가.
-- 개인 포트폴리오 주소(username)는 이제 가입 이후 회원번호를 이용해 시스템이 자동으로 채워 넣으므로,
-- 저장 순서상 잠깐 비어있을 수 있어 NOT NULL 제약을 해제한다.
ALTER TABLE member ALTER COLUMN username DROP NOT NULL;

ALTER TABLE member ADD COLUMN nickname VARCHAR(30);
ALTER TABLE member ADD COLUMN affiliation VARCHAR(100);

-- 이미 가입되어 있는 기존 회원(대표님 계정)에 대한 임시 백필값.
UPDATE member SET nickname = username WHERE nickname IS NULL;
UPDATE member SET affiliation = '해당없음' WHERE affiliation IS NULL;

ALTER TABLE member ALTER COLUMN nickname SET NOT NULL;
ALTER TABLE member ALTER COLUMN affiliation SET NOT NULL;
