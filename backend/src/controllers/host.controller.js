const hostService =
    require("../services/host.service");

function getUserId(req) {
    const userId =
        Number(req.user?.id);

    return Number.isInteger(userId) &&
        userId > 0
        ? userId
        : null;
}

async function getAll(req, res, next) {
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

        const hosts =
            await hostService.getHosts(
                userId
            );

        return res.json({
            success: true,
            data: hosts
        });
    } catch (error) {
        return next(error);
    }
}

async function getOne(req, res, next) {
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

        const hostname =
            String(
                req.params.hostname || ""
            ).trim();

        if (!hostname) {
            return res.status(400).json({
                success: false,
                message:
                    "Hostname is required."
            });
        }

        const host =
            await hostService
                .getHostByHostname(
                    userId,
                    hostname
                );

        if (!host) {
            return res.status(404).json({
                success: false,
                message:
                    "Host was not found."
            });
        }

        return res.json({
            success: true,
            data: host
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getAll,
    getOne
};