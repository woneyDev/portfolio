CREATE EXTENSION IF NOT EXISTS pgcrypto; -- bcrypt-compatible crypt()/gen_salt('bf', N)

CREATE TABLE member (
    id                             BIGSERIAL PRIMARY KEY,
    username                       VARCHAR(30)  NOT NULL,
    email                          VARCHAR(255) NOT NULL,
    password_hash                  VARCHAR(60)  NOT NULL,
    email_verified                 BOOLEAN      NOT NULL DEFAULT false,
    verification_token             VARCHAR(36),
    verification_token_expires_at  TIMESTAMP,
    created_at                     TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT uq_member_username UNIQUE (username),
    CONSTRAINT uq_member_email    UNIQUE (email)
);

-- backfill "member #1" from the existing singleton portfolio_owner row — already verified, since this is the owner's own account
INSERT INTO member (username, email, password_hash, email_verified, created_at)
SELECT '${member1Username}', po.email,
       crypt('${adminPassword}', gen_salt('bf', 10)), true, now()
FROM portfolio_owner po
LIMIT 1;

ALTER TABLE portfolio_owner ADD COLUMN member_id BIGINT;
UPDATE portfolio_owner SET member_id = (SELECT id FROM member LIMIT 1);
ALTER TABLE portfolio_owner ALTER COLUMN member_id SET NOT NULL;
ALTER TABLE portfolio_owner ADD CONSTRAINT uq_portfolio_owner_member UNIQUE (member_id);
ALTER TABLE portfolio_owner ADD CONSTRAINT fk_portfolio_owner_member
    FOREIGN KEY (member_id) REFERENCES member(id);

ALTER TABLE project ADD COLUMN has_demo BOOLEAN NOT NULL DEFAULT false;
UPDATE project SET has_demo = true WHERE title IN (
    '신용보증기금 모바일 전자고지',
    '신한투자증권 고객통지업무 디지털화'
);

CREATE INDEX idx_skill_owner_id   ON skill(owner_id);
CREATE INDEX idx_project_owner_id ON project(owner_id);
CREATE INDEX idx_career_owner_id  ON career(owner_id);
CREATE INDEX idx_project_tech_stack_project_id ON project_tech_stack(project_id);
CREATE INDEX idx_career_achievement_career_id  ON career_achievement(career_id);
