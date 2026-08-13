const pool =
    require("../config/database");

function validateId(value, message) {
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
| Create Connection
|--------------------------------------------------------------------------
*/

async function createConnection({
    userId,
    name,
    agentKeyHash,
    agentKeyHint
}) {
    const ownerId =
        validateId(
            userId,
            "A valid connection owner is required."
        );

    const result =
        await pool.query(
            `
            INSERT INTO host_connections
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
                disconnected_at AS "disconnectedAt",
                created_at AS "createdAt",
                updated_at AS "updatedAt";
            `,
            [
                ownerId,
                name,
                agentKeyHash,
                agentKeyHint
            ]
        );

    return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Get User Connections
|--------------------------------------------------------------------------
*/

async function getConnections(userId) {
    const ownerId =
        validateId(
            userId,
            "A valid connection owner is required."
        );

    const result =
        await pool.query(
            `
            SELECT
                connection.id,
                connection.name,

                connection.agent_key_hint
                    AS "agentKeyHint",

                connection.status,

                connection.last_seen
                    AS "lastSeen",

                connection.last_error
                    AS "lastError",

                connection.disconnected_at
                    AS "disconnectedAt",

                connection.created_at
                    AS "createdAt",

                connection.updated_at
                    AS "updatedAt",

                host.id
                    AS "hostId",

                host.hostname,

                host.platform,

                host.architecture,

                host.status
                    AS "hostStatus",

                host.last_seen
                    AS "hostLastSeen"

            FROM host_connections
                AS connection

            LEFT JOIN hosts
                AS host
                ON host.connection_id =
                    connection.id

            WHERE connection.user_id = $1

            ORDER BY
                connection.created_at DESC;
            `,
            [ownerId]
        );

    return result.rows;
}

/*
|--------------------------------------------------------------------------
| Find Connection Using Agent Key
|--------------------------------------------------------------------------
|
| Only the SHA-256 hash is stored. The original private key is never saved.
|--------------------------------------------------------------------------
*/

async function findConnectionByAgentKeyHash(
    agentKeyHash
) {
    const result =
        await pool.query(
            `
            SELECT
                id,

                user_id
                    AS "userId",

                name,

                status,

                last_seen
                    AS "lastSeen",

                disconnected_at
                    AS "disconnectedAt"

            FROM host_connections

            WHERE agent_key_hash = $1

            LIMIT 1;
            `,
            [agentKeyHash]
        );

    return result.rows[0] || null;
}

/*
|--------------------------------------------------------------------------
| Disconnect Connection
|--------------------------------------------------------------------------
|
| The key remains stored only as a hash, but DISCONNECTED connections are
| rejected by the agent authentication middleware. Existing history remains.
|--------------------------------------------------------------------------
*/

async function disconnectConnection(
    connectionId,
    userId
) {
    const id =
        validateId(
            connectionId,
            "A valid connection ID is required."
        );

    const ownerId =
        validateId(
            userId,
            "A valid connection owner is required."
        );

    const client =
        await pool.connect();

    try {
        await client.query("BEGIN");

        const connectionResult =
            await client.query(
                `
                UPDATE host_connections
                SET
                    status = 'DISCONNECTED',
                    disconnected_at =
                        CURRENT_TIMESTAMP,
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
                    disconnected_at
                        AS "disconnectedAt",
                    updated_at
                        AS "updatedAt";
                `,
                [
                    id,
                    ownerId
                ]
            );

        const connection =
            connectionResult.rows[0];

        if (!connection) {
            await client.query("ROLLBACK");

            return null;
        }

        await client.query(
            `
            UPDATE hosts
            SET
                status = 'OFFLINE',
                updated_at =
                    CURRENT_TIMESTAMP
            WHERE connection_id = $1
            AND user_id = $2;
            `,
            [
                id,
                ownerId
            ]
        );

        await client.query("COMMIT");

        return connection;
    } catch (error) {
        await client.query("ROLLBACK");

        throw error;
    } finally {
        client.release();
    }
}

/*
|--------------------------------------------------------------------------
| Delete Connection
|--------------------------------------------------------------------------
|
| PostgreSQL cascades this deletion to the connected host and that host's
| account-owned metric history.
|--------------------------------------------------------------------------
*/

async function deleteConnection(
    connectionId,
    userId
) {
    const id =
        validateId(
            connectionId,
            "A valid connection ID is required."
        );

    const ownerId =
        validateId(
            userId,
            "A valid connection owner is required."
        );

    const result =
        await pool.query(
            `
            DELETE FROM host_connections
            WHERE id = $1
            AND user_id = $2
            RETURNING
                id,
                name,
                status;
            `,
            [
                id,
                ownerId
            ]
        );

    return result.rows[0] || null;
}

module.exports = {
    createConnection,
    getConnections,
    findConnectionByAgentKeyHash,
    disconnectConnection,
    deleteConnection
};
