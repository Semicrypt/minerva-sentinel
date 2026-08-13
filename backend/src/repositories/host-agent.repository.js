const pool =
    require("../config/database");

function validateId(
    value,
    message
) {
    const id =
        Number(value);

    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {
        throw new Error(message);
    }

    return id;
}

/*
|--------------------------------------------------------------------------
| Save Authenticated Host Metrics
|--------------------------------------------------------------------------
|
| One transaction updates:
|
| 1. The account-owned host
| 2. The host's metric history
| 3. The private connection's status and last-seen time
|--------------------------------------------------------------------------
*/

async function saveHostMetrics({
    connectionId,
    userId,
    metrics,
    status
}) {
    const verifiedConnectionId =
        validateId(
            connectionId,
            "A valid host connection is required."
        );

    const ownerId =
        validateId(
            userId,
            "A valid host owner is required."
        );

    const client =
        await pool.connect();

    try {
        await client.query("BEGIN");

        /*
        | Lock and recheck the connection.
        |
        | This prevents a metric upload from completing if
        | the user disconnects the host at the same moment.
        */

        const connectionCheck =
            await client.query(
                `
                SELECT
                    id,
                    user_id,
                    name,
                    status
                FROM host_connections
                WHERE id = $1
                AND user_id = $2
                FOR UPDATE;
                `,
                [
                    verifiedConnectionId,
                    ownerId
                ]
            );

        const verifiedConnection =
            connectionCheck.rows[0];

        if (
            !verifiedConnection ||
            verifiedConnection.status ===
                "DISCONNECTED"
        ) {
            await client.query("ROLLBACK");

            return null;
        }

        /*
        | Find a host already attached to this connection.
        */

        const connectedHostResult =
            await client.query(
                `
                SELECT
                    id,
                    hostname
                FROM hosts
                WHERE connection_id = $1
                AND user_id = $2
                LIMIT 1
                FOR UPDATE;
                `,
                [
                    verifiedConnectionId,
                    ownerId
                ]
            );

        let host =
            connectedHostResult.rows[0] ||
            null;

        if (host) {
            /*
            | Update the host already owned by this
            | exact private connection.
            */

            const updatedHostResult =
                await client.query(
                    `
                    UPDATE hosts
                    SET
                        hostname = $3,
                        platform = $4,
                        architecture = $5,
                        latest_cpu = $6,
                        latest_memory = $7,
                        latest_disk = $8,
                        latest_uptime = $9,
                        last_seen =
                            CURRENT_TIMESTAMP,
                        status = $10,
                        updated_at =
                            CURRENT_TIMESTAMP
                    WHERE connection_id = $1
                    AND user_id = $2
                    RETURNING *;
                    `,
                    [
                        verifiedConnectionId,
                        ownerId,
                        metrics.hostname,
                        metrics.platform,
                        metrics.architecture,
                        metrics.cpu,
                        metrics.memory,
                        metrics.disk,
                        metrics.uptime,
                        status
                    ]
                );

            host =
                updatedHostResult.rows[0];
        } else {
            /*
            | An older host may already exist for this user
            | without a connection_id. It can safely be
            | adopted by the new private connection.
            */

            const existingHostResult =
                await client.query(
                    `
                    SELECT
                        id,

                        connection_id
                            AS "connectionId"

                    FROM hosts

                    WHERE user_id = $1
                    AND hostname = $2

                    LIMIT 1
                    FOR UPDATE;
                    `,
                    [
                        ownerId,
                        metrics.hostname
                    ]
                );

            const existingHost =
                existingHostResult.rows[0] ||
                null;

            if (
                existingHost?.connectionId &&
                Number(
                    existingHost.connectionId
                ) !== verifiedConnectionId
            ) {
                const error =
                    new Error(
                        "This hostname is already connected to another host agent."
                    );

                error.code =
                    "HOSTNAME_ALREADY_CONNECTED";

                throw error;
            }

            if (existingHost) {
                const adoptedHostResult =
                    await client.query(
                        `
                        UPDATE hosts
                        SET
                            connection_id = $1,
                            platform = $3,
                            architecture = $4,
                            latest_cpu = $5,
                            latest_memory = $6,
                            latest_disk = $7,
                            latest_uptime = $8,
                            last_seen =
                                CURRENT_TIMESTAMP,
                            status = $9,
                            updated_at =
                                CURRENT_TIMESTAMP
                        WHERE id = $2
                        AND user_id = $10
                        RETURNING *;
                        `,
                        [
                            verifiedConnectionId,
                            existingHost.id,
                            metrics.platform,
                            metrics.architecture,
                            metrics.cpu,
                            metrics.memory,
                            metrics.disk,
                            metrics.uptime,
                            status,
                            ownerId
                        ]
                    );

                host =
                    adoptedHostResult.rows[0];
            } else {
                const createdHostResult =
                    await client.query(
                        `
                        INSERT INTO hosts
                        (
                            user_id,
                            connection_id,
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
                            $9,
                            CURRENT_TIMESTAMP,
                            $10
                        )
                        RETURNING *;
                        `,
                        [
                            ownerId,
                            verifiedConnectionId,
                            metrics.hostname,
                            metrics.platform,
                            metrics.architecture,
                            metrics.cpu,
                            metrics.memory,
                            metrics.disk,
                            metrics.uptime,
                            status
                        ]
                    );

                host =
                    createdHostResult.rows[0];
            }
        }

        /*
        | Save history against the exact host ID.
        */

        const metricResult =
            await client.query(
                `
                INSERT INTO metrics
                (
                    host_id,
                    hostname,
                    cpu_usage,
                    memory_usage,
                    disk_usage,
                    uptime,
                    platform,
                    architecture
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
                    $8
                )
                RETURNING *;
                `,
                [
                    host.id,
                    metrics.hostname,
                    metrics.cpu,
                    metrics.memory,
                    metrics.disk,
                    metrics.uptime,
                    metrics.platform,
                    metrics.architecture
                ]
            );

        /*
        | A successful authenticated upload makes
        | the connection ONLINE.
        */

        const connectionResult =
            await client.query(
                `
                UPDATE host_connections
                SET
                    status = 'ONLINE',
                    last_seen =
                        CURRENT_TIMESTAMP,
                    last_error = NULL,
                    updated_at =
                        CURRENT_TIMESTAMP
                WHERE id = $1
                AND user_id = $2
                RETURNING
                    id,
                    name,

                    agent_key_hint
                        AS "agentKeyHint",

                    status,

                    last_seen
                        AS "lastSeen",

                    updated_at
                        AS "updatedAt";
                `,
                [
                    verifiedConnectionId,
                    ownerId
                ]
            );

        await client.query("COMMIT");

        return {
            connection:
                connectionResult.rows[0],

            host,

            metric:
                metricResult.rows[0]
        };
    } catch (error) {
        await client.query("ROLLBACK");

        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    saveHostMetrics
};
