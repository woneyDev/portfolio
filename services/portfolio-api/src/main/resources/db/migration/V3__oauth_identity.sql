CREATE TABLE oauth_identity (
    id                BIGSERIAL PRIMARY KEY,
    member_id         BIGINT       NOT NULL REFERENCES member(id),
    provider          VARCHAR(20)  NOT NULL,
    provider_user_id  VARCHAR(255) NOT NULL,
    created_at        TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT uq_oauth_provider_user UNIQUE (provider, provider_user_id)
);

CREATE INDEX idx_oauth_identity_member_id ON oauth_identity(member_id);

-- 소셜 로그인만으로 가입하는 회원은 비밀번호가 없을 수 있음
ALTER TABLE member ALTER COLUMN password_hash DROP NOT NULL;
