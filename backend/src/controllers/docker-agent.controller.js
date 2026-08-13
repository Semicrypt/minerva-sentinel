const repository =
    require(
        "../repositories/docker-snapshot.repository"
    );

function isObject(value) {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
}

function validateArray(
    value,
    name,
    maximumItems
) {
    if (!Array.isArray(value)) {
        return `${name} must be an array.`;
    }

    if (value.length > maximumItems) {
        return `${name} exceeds the allowed item count.`;
    }

    return null;
}

async function receiveSnapshot(
    req,
    res,
    next
) {
    try {
        const connection =
            req.dockerConnection;

        if (!connection?.id) {
            return res.status(401).json({
                success: false,
                message:
                    "Docker connection is invalid."
            });
        }

        const {
            engineInfo,
            containers,
            images,
            networks,
            volumes,
            collectedAt
        } = req.body || {};

        if (!isObject(engineInfo)) {
            return res.status(400).json({
                success: false,
                message:
                    "engineInfo must be an object."
            });
        }

        const arrayError =
            validateArray(
                containers,
                "containers",
                5000
            ) ||
            validateArray(
                images,
                "images",
                5000
            ) ||
            validateArray(
                networks,
                "networks",
                2000
            ) ||
            validateArray(
                volumes,
                "volumes",
                5000
            );

        if (arrayError) {
            return res.status(400).json({
                success: false,
                message: arrayError
            });
        }

        const collectedDate =
            new Date(collectedAt);

        if (
            !collectedAt ||
            Number.isNaN(
                collectedDate.getTime()
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "A valid collectedAt timestamp is required."
            });
        }

        const savedConnection =
            await repository.saveSnapshot({
                connectionId:
                    connection.id,
                engineInfo,
                containers,
                images,
                networks,
                volumes,
                collectedAt:
                    collectedDate
            });

        return res.status(202).json({
            success: true,
            message:
                "Docker snapshot accepted.",
            data: {
                connection:
                    savedConnection,
                counts: {
                    containers:
                        containers.length,
                    images:
                        images.length,
                    networks:
                        networks.length,
                    volumes:
                        volumes.length
                }
            }
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    receiveSnapshot
};
