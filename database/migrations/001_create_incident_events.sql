BEGIN;

CREATE TABLE IF NOT EXISTS incident_events (
    id BIGSERIAL PRIMARY KEY,

    incident_id INTEGER NOT NULL
        REFERENCES incidents(id)
        ON DELETE CASCADE,

    event_type VARCHAR(40) NOT NULL
        CHECK (
            event_type IN (
                'DETECTED',
                'ACKNOWLEDGED',
                'RESOLVED',
                'ROOT_CAUSE_ADDED',
                'REMEDIATION_ADDED'
            )
        ),

    actor_user_id INTEGER
        REFERENCES users(id)
        ON DELETE SET NULL,

    details TEXT,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_incident_events_incident_time
    ON incident_events (incident_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_incident_events_created_at
    ON incident_events (created_at DESC);

-- Create truthful detection events from each incident's real creation time.
INSERT INTO incident_events (
    incident_id,
    event_type,
    details,
    metadata,
    created_at
)
SELECT
    i.id,
    'DETECTED',
    NULLIF(BTRIM(i.description), ''),
    '{"backfilled": true}'::jsonb,
    i.created_at
FROM incidents AS i
WHERE NOT EXISTS (
    SELECT 1
    FROM incident_events AS event
    WHERE event.incident_id = i.id
      AND event.event_type = 'DETECTED'
);

-- Create truthful resolution events only where a real resolution time exists.
INSERT INTO incident_events (
    incident_id,
    event_type,
    metadata,
    created_at
)
SELECT
    i.id,
    'RESOLVED',
    '{"backfilled": true}'::jsonb,
    i.resolved_at
FROM incidents AS i
WHERE i.resolved_at IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM incident_events AS event
      WHERE event.incident_id = i.id
        AND event.event_type = 'RESOLVED'
  );

COMMIT;
