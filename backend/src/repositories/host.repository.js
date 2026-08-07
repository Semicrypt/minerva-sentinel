const pool =
    require("../config/database");

/*
|--------------------------------------------------------------------------
| Update Host
|--------------------------------------------------------------------------
|
| A fresh metric payload automatically creates the host if it does not
| already exist.
|
| Existing hosts are updated by hostname.
|--------------------------------------------------------------------------
*/

async function updateHost(metrics) {

    const result =
        await pool.query(

            `
            INSERT INTO hosts
            (
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
                NOW(),
                $8
            )

            ON CONFLICT (hostname)

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
| Get All Hosts
|--------------------------------------------------------------------------
*/

async function getHosts() {

    const result =
        await pool.query(

            `
            SELECT *

            FROM hosts

            ORDER BY hostname;
            `

        );

    return result.rows;

}

/*
|--------------------------------------------------------------------------
| Mark Stale Hosts Offline
|--------------------------------------------------------------------------
|
| PostgreSQL performs the time comparison itself.
|
| This avoids browser timezone problems and keeps health evaluation inside
| the backend/database layer.
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

                last_seen IS NULL

                OR last_seen <
                    NOW() -
                    ($1 * INTERVAL '1 second')

            AND status <> 'OFFLINE'

            RETURNING *;
            `,

            [
                thresholdSeconds
            ]

        );

    return result.rows;

}

module.exports = {

    updateHost,

    getHosts,

    markOfflineHosts

};