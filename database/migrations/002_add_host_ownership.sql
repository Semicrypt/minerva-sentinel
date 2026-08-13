BEGIN;

ALTER TABLE hosts
ADD COLUMN IF NOT EXISTS user_id INTEGER;

-- The only remaining legitimate host belongs to
-- user 1: Ifeanyi Divine.
UPDATE hosts
SET user_id = 1
WHERE hostname = 'Divine'
AND user_id IS NULL;

-- Stop the migration if any unowned host remains.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM hosts
        WHERE user_id IS NULL
    ) THEN
        RAISE EXCEPTION
            'Cannot enforce host ownership: unowned hosts remain.';
    END IF;
END
$$;

ALTER TABLE hosts
ALTER COLUMN user_id SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname =
            'hosts_user_id_fkey'
    ) THEN
        ALTER TABLE hosts
        ADD CONSTRAINT hosts_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE;
    END IF;
END
$$;

-- Hostnames are no longer globally unique.
ALTER TABLE hosts
DROP CONSTRAINT IF EXISTS hosts_hostname_key;

-- Two different users may monitor machines with
-- the same hostname, but one user cannot duplicate it.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname =
            'hosts_user_hostname_key'
    ) THEN
        ALTER TABLE hosts
        ADD CONSTRAINT hosts_user_hostname_key
        UNIQUE (user_id, hostname);
    END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_hosts_user_id
ON hosts(user_id);

COMMIT;
