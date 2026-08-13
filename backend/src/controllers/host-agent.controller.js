const hostAgentService =
    require(
        "../services/host-agent.service"
    );

/*
|--------------------------------------------------------------------------
| Receive Host Metrics
|--------------------------------------------------------------------------
|
| Authentication is handled before this controller runs.
| req.hostConnection contains the verified connection and account owner.
|--------------------------------------------------------------------------
*/

async function receiveMetrics(
    req,
    res,
    next
) {
    try {
        const result =
            await hostAgentService
                .saveAuthenticatedMetrics(
                    req.hostConnection,
                    req.body
                );

        /*
        | The connection may have been disconnected
        | immediately after middleware authentication.
        */

        if (!result) {
            return res.status(403).json({
                success: false,
                accepted: false,
                message:
                    "This host connection has been disconnected."
            });
        }

        return res.status(202).json({
            success: true,
            accepted: true,
            message:
                "Host metrics accepted.",
            data: {
                connection: {
                    id:
                        result.connection.id,

                    name:
                        result.connection.name,

                    status:
                        result.connection.status,

                    lastSeen:
                        result.connection.lastSeen
                },

                host: {
                    id:
                        result.host.id,

                    hostname:
                        result.host.hostname,

                    platform:
                        result.host.platform,

                    architecture:
                        result.host.architecture,

                    status:
                        result.host.status,

                    lastSeen:
                        result.host.last_seen
                },

                metric: {
                    id:
                        result.metric.id,

                    hostId:
                        result.metric.host_id,

                    createdAt:
                        result.metric.created_at
                }
            }
        });
    } catch (error) {
        /*
        | Prevent two private connections in the
        | same account from controlling one hostname.
        */

        if (
            error.code ===
                "HOSTNAME_ALREADY_CONNECTED" ||
            error.code === "23505"
        ) {
            return res.status(409).json({
                success: false,
                accepted: false,
                message:
                    "This hostname is already connected to another host agent in your account."
            });
        }

        return next(error);
    }
}

module.exports = {
    receiveMetrics
};
