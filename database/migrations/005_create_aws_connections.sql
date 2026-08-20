BEGIN;

CREATE TABLE IF NOT EXISTS aws_connections (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,

    role_arn VARCHAR(2048) NOT NULL,

    region VARCHAR(32) NOT NULL,

    account_id VARCHAR(12),

    status VARCHAR(20) NOT NULL
        DEFAULT 'PENDING',

    last_checked_at TIMESTAMP WITHOUT TIME ZONE,

    last_error TEXT,

    created_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT aws_connections_user_name_key
        UNIQUE (user_id, name),

    CONSTRAINT aws_connections_status_check
        CHECK (
            status IN (
                'PENDING',
                'CONNECTED',
                'ERROR',
                'DISCONNECTED'
            )
        ),

    CONSTRAINT aws_connections_role_arn_check
        CHECK (
            role_arn ~ '^arn:[^:]+:iam::[0-9]{12}:role/.+'
        ),

    CONSTRAINT aws_connections_account_id_check
        CHECK (
            account_id IS NULL
            OR account_id ~ '^[0-9]{12}$'
        )
);

CREATE INDEX IF NOT EXISTS
    idx_aws_connections_user_id
ON aws_connections(user_id);

CREATE INDEX IF NOT EXISTS
    idx_aws_connections_user_status
ON aws_connections(user_id, status);

CREATE INDEX IF NOT EXISTS
    idx_aws_connections_user_region
ON aws_connections(user_id, region);

COMMIT;
