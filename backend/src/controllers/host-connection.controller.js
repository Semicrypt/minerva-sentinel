const crypto =
    require("crypto");

const repository =
    require(
        "../repositories/host-connection.repository"
    );

function getUserId(req) {
    const userId =
        Number(req.user?.id);

    return Number.isInteger(userId) &&
        userId > 0
        ? userId
        : null;
}

function getConnectionId(req) {
    const connectionId =
        Number(req.params.id);

    return Number.isInteger(connectionId) &&
        connectionId > 0
        ? connectionId
        : null;
}

/*
|--------------------------------------------------------------------------
| Private Agent Key
|--------------------------------------------------------------------------
|
| The original key is returned only once. PostgreSQL receives only its
| SHA-256 hash.
|--------------------------------------------------------------------------
*/

function createAgentKey() {
    return (
        "mshk_" +
        crypto
            .randomBytes(32)
            .toString("hex")
    );
}

function hashAgentKey(agentKey) {
    return crypto
        .createHash("sha256")
        .update(agentKey)
        .digest("hex");
}

function createAgentKeyHint(agentKey) {
    return (
        `${agentKey.slice(0, 10)}` +
        "..." +
        `${agentKey.slice(-4)}`
    );
}

/*
|--------------------------------------------------------------------------
| Create Host Connection
|--------------------------------------------------------------------------
*/

async function createConnection(
    req,
    res,
    next
) {
    try {
        const userId =
            getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated user is invalid."
            });
        }

        const name =
            String(
                req.body?.name || ""
            ).trim();

        if (!name) {
            return res.status(400).json({
                success: false,
                message:
                    "Host connection name is required."
            });
        }

        if (name.length > 100) {
            return res.status(400).json({
                success: false,
                message:
                    "Host connection name must not exceed 100 characters."
            });
        }

        const agentKey =
            createAgentKey();

        const agentKeyHash =
            hashAgentKey(agentKey);

        const agentKeyHint =
            createAgentKeyHint(
                agentKey
            );

        const connection =
            await repository
                .createConnection({
                    userId,
                    name,
                    agentKeyHash,
                    agentKeyHint
                });

        return res.status(201).json({
            success: true,
            message:
                "Host connection created. Save the private agent key now because it will not be shown again.",
            data: {
                connection,
                agentKey
            }
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message:
                    "A host connection with this name already exists."
            });
        }

        return next(error);
    }
}

/*
|--------------------------------------------------------------------------
| List User Connections
|--------------------------------------------------------------------------
*/

async function getConnections(
    req,
    res,
    next
) {
    try {
        const userId =
            getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated user is invalid."
            });
        }

        const connections =
            await repository
                .getConnections(
                    userId
                );

        return res.json({
            success: true,
            data: connections
        });
    } catch (error) {
        return next(error);
    }
}

/*
|--------------------------------------------------------------------------
| Disconnect Host
|--------------------------------------------------------------------------
|
| Disconnecting revokes future uploads but preserves the host and history.
|--------------------------------------------------------------------------
*/

async function disconnectConnection(
    req,
    res,
    next
) {
    try {
        const userId =
            getUserId(req);

        const connectionId =
            getConnectionId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated user is invalid."
            });
        }

        if (!connectionId) {
            return res.status(400).json({
                success: false,
                message:
                    "Host connection ID is invalid."
            });
        }

        const connection =
            await repository
                .disconnectConnection(
                    connectionId,
                    userId
                );

        if (!connection) {
            return res.status(404).json({
                success: false,
                message:
                    "Host connection was not found."
            });
        }

        return res.json({
            success: true,
            message:
                "Host disconnected. Its private key is no longer accepted.",
            data: connection
        });
    } catch (error) {
        return next(error);
    }
}

/*
|--------------------------------------------------------------------------
| Delete Host
|--------------------------------------------------------------------------
|
| Deleting permanently removes the connection, connected host and that
| host's account-owned metric history.
|--------------------------------------------------------------------------
*/

async function deleteConnection(
    req,
    res,
    next
) {
    try {
        const userId =
            getUserId(req);

        const connectionId =
            getConnectionId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated user is invalid."
            });
        }

        if (!connectionId) {
            return res.status(400).json({
                success: false,
                message:
                    "Host connection ID is invalid."
            });
        }

        const connection =
            await repository
                .deleteConnection(
                    connectionId,
                    userId
                );

        if (!connection) {
            return res.status(404).json({
                success: false,
                message:
                    "Host connection was not found."
            });
        }

        return res.json({
            success: true,
            message:
                "Host connection and its saved monitoring data were deleted.",
            data: connection
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createConnection,
    getConnections,
    disconnectConnection,
    deleteConnection
};
