BEGIN;

ALTER TABLE aws_connections
ADD COLUMN IF NOT EXISTS external_id VARCHAR(80);

-- Backfill any existing connections.
UPDATE aws_connections
SET external_id =
    'msaws_' ||
    md5(
        user_id::text ||
        ':' ||
        id::text ||
        ':' ||
        clock_timestamp()::text ||
        ':' ||
        random()::text
    )
WHERE external_id IS NULL;

ALTER TABLE aws_connections
ALTER COLUMN external_id SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname =
            'aws_connections_external_id_key'
        AND conrelid =
            'aws_connections'::regclass
    ) THEN
        ALTER TABLE aws_connections
        ADD CONSTRAINT
            aws_connections_external_id_key
        UNIQUE (external_id);
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname =
            'aws_connections_external_id_check'
        AND conrelid =
            'aws_connections'::regclass
    ) THEN
        ALTER TABLE aws_connections
        ADD CONSTRAINT
            aws_connections_external_id_check
        CHECK (
            external_id ~
            '^msaws_[0-9a-f]{32,64}$'
        );
    END IF;
END
$$;

COMMIT;
