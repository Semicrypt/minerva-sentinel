BEGIN;

CREATE TABLE IF NOT EXISTS docker_connections (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,

    agent_key_hash CHAR(64) NOT NULL UNIQUE,

    agent_key_hint VARCHAR(20) NOT NULL,

    status VARCHAR(20) NOT NULL
        DEFAULT 'PENDING'
        CHECK (
            status IN (
                'PENDING',
                'ONLINE',
                'OFFLINE'
            )
        ),

    last_seen TIMESTAMP WITHOUT TIME ZONE,

    last_error TEXT,

    created_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT docker_connections_user_name_key
        UNIQUE (user_id, name)
);

CREATE INDEX IF NOT EXISTS
    idx_docker_connections_user_id
ON docker_connections(user_id);

CREATE INDEX IF NOT EXISTS
    idx_docker_connections_status
ON docker_connections(user_id, status);

CREATE TABLE IF NOT EXISTS docker_snapshots (
    connection_id INTEGER PRIMARY KEY
        REFERENCES docker_connections(id)
        ON DELETE CASCADE,

    engine_info JSONB NOT NULL
        DEFAULT '{}'::jsonb,

    containers JSONB NOT NULL
        DEFAULT '[]'::jsonb,

    images JSONB NOT NULL
        DEFAULT '[]'::jsonb,

    networks JSONB NOT NULL
        DEFAULT '[]'::jsonb,

    volumes JSONB NOT NULL
        DEFAULT '[]'::jsonb,

    collected_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL,

    updated_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT docker_snapshots_containers_array
        CHECK (
            jsonb_typeof(containers) = 'array'
        ),

    CONSTRAINT docker_snapshots_images_array
        CHECK (
            jsonb_typeof(images) = 'array'
        ),

    CONSTRAINT docker_snapshots_networks_array
        CHECK (
            jsonb_typeof(networks) = 'array'
        ),

    CONSTRAINT docker_snapshots_volumes_array
        CHECK (
            jsonb_typeof(volumes) = 'array'
        )
);

COMMIT;
