const pool =
    require("../config/database");

async function findConnectionByAgentKeyHash(
    agentKeyHash
) {
    const result =
        await pool.query(
            `
            SELECT
                id,
                user_id AS "userId",
                name,
                status
            FROM docker_connections
            WHERE agent_key_hash = $1
            LIMIT 1;
            `,
            [agentKeyHash]
        );

    return result.rows[0] || null;
}

async function saveSnapshot({
    connectionId,
    engineInfo,
    containers,
    images,
    networks,
    volumes,
    collectedAt
}) {
    const client =
        await pool.connect();

    try {
        await client.query("BEGIN");

        await client.query(
            `
            INSERT INTO docker_snapshots
            (
                connection_id,
                engine_info,
                containers,
                images,
                networks,
                volumes,
                collected_at
            )
            VALUES
            (
                $1,
                $2::jsonb,
                $3::jsonb,
                $4::jsonb,
                $5::jsonb,
                $6::jsonb,
                $7
            )
            ON CONFLICT (connection_id)
            DO UPDATE SET
                engine_info =
                    EXCLUDED.engine_info,

                containers =
                    EXCLUDED.containers,

                images =
                    EXCLUDED.images,

                networks =
                    EXCLUDED.networks,

                volumes =
                    EXCLUDED.volumes,

                collected_at =
                    EXCLUDED.collected_at,

                updated_at =
                    CURRENT_TIMESTAMP;
            `,
            [
                connectionId,
                JSON.stringify(engineInfo),
                JSON.stringify(containers),
                JSON.stringify(images),
                JSON.stringify(networks),
                JSON.stringify(volumes),
                collectedAt
            ]
        );

        const connectionResult =
            await client.query(
                `
                UPDATE docker_connections
                SET
                    status = 'ONLINE',
                    last_seen =
                        CURRENT_TIMESTAMP,
                    last_error = NULL,
                    updated_at =
                        CURRENT_TIMESTAMP
                WHERE id = $1
                RETURNING
                    id,
                    name,
                    status,
                    last_seen AS "lastSeen";
                `,
                [connectionId]
            );

        await client.query("COMMIT");

        return connectionResult.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

async function getLatestSnapshotForUser(
    userId
) {
    const result =
        await pool.query(
            `
            SELECT
                connection.id
                    AS "connectionId",

                connection.name
                    AS "connectionName",

                connection.status,

                connection.last_seen
                    AS "lastSeen",

                snapshot.engine_info
                    AS "engineInfo",

                snapshot.containers,

                snapshot.images,

                snapshot.networks,

                snapshot.volumes,

                snapshot.collected_at
                    AS "collectedAt"
            FROM docker_connections
                AS connection
            JOIN docker_snapshots
                AS snapshot
                ON snapshot.connection_id =
                    connection.id
            WHERE connection.user_id = $1
            ORDER BY
                snapshot.collected_at DESC,
                connection.id DESC
            LIMIT 1;
            `,
            [userId]
        );

    return result.rows[0] || null;
}

module.exports = {
    findConnectionByAgentKeyHash,
    saveSnapshot,
    getLatestSnapshotForUser
};