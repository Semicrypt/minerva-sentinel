const crypto =
    require("crypto");

const repository =
    require(
        "../repositories/docker-snapshot.repository"
    );

function hashAgentKey(agentKey) {
    return crypto
        .createHash("sha256")
        .update(agentKey)
        .digest("hex");
}

async function dockerAgentAuth(
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
                    "Minerva agent key is required."
            });
        }

        if (
            !agentKey.startsWith("msdk_") ||
            agentKey.length > 100
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Minerva agent key is invalid."
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
                    "Minerva agent key is invalid."
            });
        }

        req.dockerConnection =
            connection;

        return next();
    } catch (error) {
        return next(error);
    }
}

module.exports =
    dockerAgentAuth;
