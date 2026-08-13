const pool =
    require("../config/database");

function validateUserId(userId) {
    const value = Number(userId);

    if (
        !Number.isInteger(value) ||
        value <= 0
    ) {
        throw new Error(
            "A valid host owner is required."
        );
    }

    return value;
}

/*
|--------------------------------------------------------------------------
| Update Host
|--------------------------------------------------------------------------
|
| Hosts are unique within an account. Different users may monitor machines
| that have the same hostname.
|--------------------------------------------------------------------------
*/

async function updateHost(
    metrics,
    userId
) {
    const ownerId =
        validateUserId(userId);

    const result =
        await pool.query(
            `
            INSERT INTO hosts
            (
                user_id,
                hostname,
                platform,
                architecture,
                latest_cpu,
                latest_memory,
                latest_disk,
                latest_uptime,
                last_seen,
                status
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                NOW(),
                $9
            )
            ON CONFLICT
                (user_id, hostname)
            DO UPDATE SET
                platform =
                    EXCLUDED.platform,

                architecture =
                    EXCLUDED.architecture,

                latest_cpu =
                    EXCLUDED.latest_cpu,

                latest_memory =
                    EXCLUDED.latest_memory,

                latest_disk =
                    EXCLUDED.latest_disk,

                latest_uptime =
                    EXCLUDED.latest_uptime,

                last_seen =
                    NOW(),

                status =
                    EXCLUDED.status,

                updated_at =
                    NOW()
            RETURNING *;
            `,
            [
                ownerId,
                metrics.hostname,
                metrics.platform,
                metrics.architecture,
                metrics.cpu,
                metrics.memory,
                metrics.disk,
                metrics.uptime,
                metrics.status
            ]
        );

    return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Get User Hosts
|--------------------------------------------------------------------------
*/

async function getHosts(userId) {
    const ownerId =
        validateUserId(userId);

    const result =
        await pool.query(
            `
            SELECT *
            FROM hosts
            WHERE user_id = $1
            ORDER BY hostname;
            `,
            [ownerId]
        );

    return result.rows;
}

/*
|--------------------------------------------------------------------------
| Get One User Host
|--------------------------------------------------------------------------
*/

async function getHostByHostname(
    userId,
    hostname
) {
    const ownerId =
        validateUserId(userId);

    const result =
        await pool.query(
            `
            SELECT *
            FROM hosts
            WHERE user_id = $1
            AND hostname = $2
            LIMIT 1;
            `,
            [
                ownerId,
                hostname
            ]
        );

    return result.rows[0] || null;
}

/*
|--------------------------------------------------------------------------
| Mark Stale Hosts Offline
|--------------------------------------------------------------------------
|
| This background health operation evaluates all owned hosts. Host reads
| remain restricted to the authenticated owner.
|--------------------------------------------------------------------------
*/

async function markOfflineHosts(
    thresholdSeconds = 30
) {
    const result =
        await pool.query(
            `
            UPDATE hosts
            SET
                status = 'OFFLINE',
                updated_at = NOW()
            WHERE
                (
                    last_seen IS NULL
                    OR last_seen <
                        NOW() -
                        ($1 * INTERVAL '1 second')
                )
            AND status <> 'OFFLINE'
            RETURNING *;
            `,
            [thresholdSeconds]
        );

    return result.rows;
}

module.exports = {
    updateHost,
    getHosts,
    getHostByHostname,
    markOfflineHosts
};