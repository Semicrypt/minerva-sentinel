const repository =
    require(
        "../repositories/docker-snapshot.repository"
    );

function getUserId(req) {
    const userId =
        Number(req.user?.id);

    return Number.isInteger(userId) &&
        userId > 0
        ? userId
        : null;
}

async function loadUserSnapshot(
    req,
    res
) {
    const userId =
        getUserId(req);

    if (!userId) {
        res.status(401).json({
            success: false,
            message:
                "Authenticated user is invalid."
        });

        return null;
    }

    const snapshot =
        await repository
            .getLatestSnapshotForUser(
                userId
            );

    if (!snapshot) {
        res.status(409).json({
            success: false,
            connected: false,
            message:
                "Docker snapshot data is not available for this account."
        });

        return null;
    }

    return snapshot;
}

function sendSnapshotData(
    res,
    snapshot,
    data
) {
    return res.json({
        success: true,
        connected: true,
        connection: {
            id:
                snapshot.connectionId,

            name:
                snapshot.connectionName,

            status:
                snapshot.status,

            lastSeen:
                snapshot.lastSeen,

            collectedAt:
                snapshot.collectedAt
        },
        data
    });
}

async function info(req, res, next) {
    try {
        const snapshot =
            await loadUserSnapshot(
                req,
                res
            );

        if (!snapshot) {
            return;
        }

        return sendSnapshotData(
            res,
            snapshot,
            snapshot.engineInfo || {}
        );
    } catch (error) {
        return next(error);
    }
}

async function containers(
    req,
    res,
    next
) {
    try {
        const snapshot =
            await loadUserSnapshot(
                req,
                res
            );

        if (!snapshot) {
            return;
        }

        const data =
            Array.isArray(
                snapshot.containers
            )
                ? snapshot.containers
                : [];

        return sendSnapshotData(
            res,
            snapshot,
            data
        );
    } catch (error) {
        return next(error);
    }
}

async function container(
    req,
    res,
    next
) {
    try {
        const snapshot =
            await loadUserSnapshot(
                req,
                res
            );

        if (!snapshot) {
            return;
        }

        const containerId =
            String(
                req.params.id || ""
            ).trim();

        const allContainers =
            Array.isArray(
                snapshot.containers
            )
                ? snapshot.containers
                : [];

        const found =
            allContainers.find(item => {
                return (
                    item.id === containerId ||
                    item.shortId ===
                        containerId
                );
            });

        if (!found) {
            return res.status(404).json({
                success: false,
                message:
                    "Container was not found in this account's Docker snapshot."
            });
        }

        return sendSnapshotData(
            res,
            snapshot,
            found
        );
    } catch (error) {
        return next(error);
    }
}

async function images(req, res, next) {
    try {
        const snapshot =
            await loadUserSnapshot(
                req,
                res
            );

        if (!snapshot) {
            return;
        }

        return sendSnapshotData(
            res,
            snapshot,
            Array.isArray(snapshot.images)
                ? snapshot.images
                : []
        );
    } catch (error) {
        return next(error);
    }
}

async function networks(
    req,
    res,
    next
) {
    try {
        const snapshot =
            await loadUserSnapshot(
                req,
                res
            );

        if (!snapshot) {
            return;
        }

        return sendSnapshotData(
            res,
            snapshot,
            Array.isArray(
                snapshot.networks
            )
                ? snapshot.networks
                : []
        );
    } catch (error) {
        return next(error);
    }
}

async function volumes(req, res, next) {
    try {
        const snapshot =
            await loadUserSnapshot(
                req,
                res
            );

        if (!snapshot) {
            return;
        }

        return sendSnapshotData(
            res,
            snapshot,
            Array.isArray(snapshot.volumes)
                ? snapshot.volumes
                : []
        );
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    info,
    containers,
    container,
    images,
    networks,
    volumes
};
