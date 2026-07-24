CREATE TABLE admin_allowed_ip (
    id          BIGSERIAL PRIMARY KEY,
    ip_address  VARCHAR(45)  NOT NULL,
    memo        VARCHAR(100),
    created_at  TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT uq_admin_allowed_ip_address UNIQUE (ip_address)
);
