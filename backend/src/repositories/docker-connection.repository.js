const pool =
    require("../config/database");

async function createConnection({
    userId,
    name,
    agentKeyHash,
    agentKeyHint
}) {
    const result =
        await pool.query(
            `
            INSERT INTO docker_connections
            (
                user_id,
                name,
                agent_key_hash,
                agent_key_hint
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                name,
                agent_key_hint AS "agentKeyHint",
                status,
                last_seen AS "lastSeen",
                created_at AS "createdAt",
                updated_at AS "updatedAt";
            `,
            [
                userId,
                name,
                agentKeyHash,
                agentKeyHint
            ]
        );

    return result.rows[0];
}

async function getConnections(userId) {
    const result =
        await pool.query(
            `
            SELECT
                id,
                name,
                agent_key_hint AS "agentKeyHint",
                status,
                last_seen AS "lastSeen",
                last_error AS "lastError",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            FROM docker_connections
            WHERE user_id = $1
            ORDER BY created_at DESC;
            `,
            [userId]
        );

    return result.rows;
}

async function deleteConnection(
    connectionId,
    userId
) {
    const result =
        await pool.query(
            `
            DELETE FROM docker_connections
            WHERE id = $1
            AND user_id = $2
            RETURNING
                id,
                name,
                agent_key_hint AS "agentKeyHint",
                status,
                last_seen AS "lastSeen",
                created_at AS "createdAt";
            `,
            [
                connectionId,
                userId
            ]
        );

    return result.rows[0] || null;
}

module.exports = {
    createConnection,
    getConnections,
    deleteConnection
};