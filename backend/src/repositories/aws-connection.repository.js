const crypto =
    require("crypto");

const pool =
    require("../config/database");

const CONNECTION_COLUMNS = `
    id,
    name,
    role_arn AS "roleArn",
    region,
    account_id AS "accountId",
    external_id AS "externalId",
    status,
    last_checked_at AS "lastCheckedAt",
    last_error AS "lastError",
    disconnected_at AS "disconnectedAt",
    created_at AS "createdAt",
    updated_at AS "updatedAt"
`;

function createExternalId() {
    return (
        "msaws_" +
        crypto
            .randomBytes(24)
            .toString("hex")
    );
}

async function createConnection({
    userId,
    name,
    roleArn,
    region
}) {
    const externalId =
        createExternalId();

    const result =
        await pool.query(
            `
            INSERT INTO aws_connections
            (
                user_id,
                name,
                role_arn,
                region,
                external_id
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                ${CONNECTION_COLUMNS};
            `,
            [
                userId,
                name,
                roleArn,
                region,
                externalId
            ]
        );

    return result.rows[0];
}

async function getConnections(userId) {
    const result =
        await pool.query(
            `
            SELECT
                ${CONNECTION_COLUMNS}
            FROM aws_connections
            WHERE user_id = $1
            ORDER BY created_at DESC;
            `,
            [userId]
        );

    return result.rows;
}

async function getConnectionById(
    connectionId,
    userId
) {
    const result =
        await pool.query(
            `
            SELECT
                ${CONNECTION_COLUMNS}
            FROM aws_connections
            WHERE id = $1
            AND user_id = $2;
            `,
            [
                connectionId,
                userId
            ]
        );

    return result.rows[0] || null;
}

async function markConnected({
    connectionId,
    userId,
    accountId
}) {
    const result =
        await pool.query(
            `
            UPDATE aws_connections
            SET
                account_id = $3,
                status = 'CONNECTED',
                last_checked_at =
                    CURRENT_TIMESTAMP,
                last_error = NULL,
                disconnected_at = NULL,
                updated_at =
                    CURRENT_TIMESTAMP
            WHERE id = $1
            AND user_id = $2
            RETURNING
                ${CONNECTION_COLUMNS};
            `,
            [
                connectionId,
                userId,
                accountId
            ]
        );

    return result.rows[0] || null;
}

async function markError({
    connectionId,
    userId,
    lastError
}) {
    const result =
        await pool.query(
            `
            UPDATE aws_connections
            SET
                status = 'ERROR',
                last_checked_at =
                    CURRENT_TIMESTAMP,
                last_error = $3,
                disconnected_at = NULL,
                updated_at =
                    CURRENT_TIMESTAMP
            WHERE id = $1
            AND user_id = $2
            RETURNING
                ${CONNECTION_COLUMNS};
            `,
            [
                connectionId,
                userId,
                lastError
            ]
        );

    return result.rows[0] || null;
}

async function disconnectConnection(
    connectionId,
    userId
) {
    const result =
        await pool.query(
            `
            UPDATE aws_connections
            SET
                status = 'DISCONNECTED',
                disconnected_at =
                    CURRENT_TIMESTAMP,
                last_error = NULL,
                updated_at =
                    CURRENT_TIMESTAMP
            WHERE id = $1
            AND user_id = $2
            RETURNING
                ${CONNECTION_COLUMNS};
            `,
            [
                connectionId,
                userId
            ]
        );

    return result.rows[0] || null;
}

async function deleteConnection(
    connectionId,
    userId
) {
    const result =
        await pool.query(
            `
            DELETE FROM aws_connections
            WHERE id = $1
            AND user_id = $2
            RETURNING
                ${CONNECTION_COLUMNS};
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
    getConnectionById,
    markConnected,
    markError,
    disconnectConnection,
    deleteConnection
};