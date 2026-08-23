BEGIN;

CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,

    service_id INTEGER NOT NULL
        REFERENCES services(id)
        ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    status VARCHAR(20)
        NOT NULL
        DEFAULT 'OPEN'
        CHECK (
            status IN (
                'OPEN',
                'ACKNOWLEDGED',
                'RESOLVED'
            )
        ),

    resolved_at TIMESTAMP WITHOUT TIME ZONE,

    created_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_incidents_service_status
    ON incidents (
        service_id,
        status
    );

CREATE INDEX IF NOT EXISTS idx_incidents_created_at
    ON incidents (
        created_at DESC
    );

COMMIT;
