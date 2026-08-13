const crypto =
    require("crypto");

const repository =
    require(
        "../repositories/host-connection.repository"
    );

function hashAgentKey(agentKey) {
    return crypto
        .createHash("sha256")
        .update(agentKey)
        .digest("hex");
}

async function hostAgentAuth(
    req,
    res,
    next
) {
    try {
        const agentKey =
            String(
                req.get(
                    "X-Minerva-Agent-Key"
                ) || ""
            ).trim();

        if (!agentKey) {
            return res.status(401).json({
                success: false,
                message:
                    "Minerva host agent key is required."
            });
        }

        /*
        | Host keys begin with mshk_ followed by
        | 64 lowercase hexadecimal characters.
        */

        if (
            !/^mshk_[a-f0-9]{64}$/.test(
                agentKey
            )
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Minerva host agent key is invalid."
            });
        }

        const agentKeyHash =
            hashAgentKey(agentKey);

        const connection =
            await repository
                .findConnectionByAgentKeyHash(
                    agentKeyHash
                );

        if (!connection) {
            return res.status(401).json({
                success: false,
                message:
                    "Minerva host agent key is invalid."
            });
        }

        if (
            connection.status ===
            "DISCONNECTED"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "This host connection has been disconnected."
            });
        }

        /*
        | The upload controller will use this verified
        | connection to assign the host and metrics to
        | the correct account.
        */

        req.hostConnection = {
            id:
                connection.id,

            userId:
                connection.userId,

            name:
                connection.name,

            status:
                connection.status
        };

        return next();
    } catch (error) {
        return next(error);
    }
}

module.exports =
    hostAgentAuth;
