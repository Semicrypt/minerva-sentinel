BEGIN;

CREATE TABLE host_connections
(
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,

    agent_key_hash CHAR(64) NOT NULL UNIQUE,

    agent_key_hint VARCHAR(20) NOT NULL,

    status VARCHAR(20) NOT NULL
        DEFAULT 'PENDING',

    last_seen TIMESTAMP WITHOUT TIME ZONE,

    last_error TEXT,

    disconnected_at
        TIMESTAMP WITHOUT TIME ZONE,

    created_at
        TIMESTAMP WITHOUT TIME ZONE
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at
        TIMESTAMP WITHOUT TIME ZONE
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT
        host_connections_user_name_key
        UNIQUE (user_id, name),

    CONSTRAINT
        host_connections_status_check
        CHECK (
            status IN (
                'PENDING',
                'ONLINE',
                'OFFLINE',
                'DISCONNECTED'
            )
        )
);

CREATE INDEX
    idx_host_connections_user_id
ON host_connections(user_id);

CREATE INDEX
    idx_host_connections_user_status
ON host_connections(user_id, status);

/*
|--------------------------------------------------------------------------
| Connect each discovered host to one private agent connection
|--------------------------------------------------------------------------
|
| This remains nullable so existing hosts are not damaged by the migration.
| All new agent-created hosts will receive a connection_id.
|--------------------------------------------------------------------------
*/

ALTER TABLE hosts
ADD COLUMN connection_id INTEGER;

ALTER TABLE hosts
ADD CONSTRAINT hosts_connection_id_fkey
FOREIGN KEY (connection_id)
REFERENCES host_connections(id)
ON DELETE CASCADE;

CREATE UNIQUE INDEX
    hosts_connection_id_key
ON hosts(connection_id)
WHERE connection_id IS NOT NULL;

/*
|--------------------------------------------------------------------------
| Assign metric history to an exact host
|--------------------------------------------------------------------------
|
| Existing global/internal metrics remain NULL deliberately. We must not
| guess which user owns historical rows using only a hostname.
|--------------------------------------------------------------------------
*/

ALTER TABLE metrics
ADD COLUMN host_id INTEGER;

ALTER TABLE metrics
ADD CONSTRAINT metrics_host_id_fkey
FOREIGN KEY (host_id)
REFERENCES hosts(id)
ON DELETE CASCADE;

CREATE INDEX
    idx_metrics_host_created_at
ON metrics(host_id, created_at DESC)
WHERE host_id IS NOT NULL;

COMMIT;
