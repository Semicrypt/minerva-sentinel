const repository = require(
    "../repositories/incident-activity.repository"
);

function getUserId(req) {
    const userId = Number(req.user?.id);

    return Number.isInteger(userId) &&
        userId > 0
        ? userId
        : null;
}

function getIncidentId(req) {
    const incidentId = Number(
        req.params.id
    );

    return Number.isInteger(incidentId) &&
        incidentId > 0
        ? incidentId
        : null;
}

function getDetails(req) {
    return String(
        req.body?.details || ""
    ).trim();
}

async function recordActivity(
    req,
    res,
    eventType,
    successMessage
) {
    try {
        const userId = getUserId(req);
        const incidentId =
            getIncidentId(req);
        const details = getDetails(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated user is invalid."
            });
        }

        if (!incidentId) {
            return res.status(400).json({
                success: false,
                message:
                    "Incident ID is invalid."
            });
        }

        if (!details) {
            return res.status(400).json({
                success: false,
                message:
                    "Activity details are required."
            });
        }

        if (details.length > 5000) {
            return res.status(400).json({
                success: false,
                message:
                    "Activity details must not exceed 5000 characters."
            });
        }

        const activity =
            await repository
                .createIncidentActivity({
                    incidentId,
                    userId,
                    eventType,
                    details
                });

        if (!activity) {
            return res.status(404).json({
                success: false,
                message:
                    "Incident was not found."
            });
        }

        return res.status(201).json({
            success: true,
            message: successMessage,
            data: activity
        });
    } catch (error) {
        console.error(
            "Unable to record incident activity:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to record incident activity."
        });
    }
}

function recordRootCause(req, res) {
    return recordActivity(
        req,
        res,
        "ROOT_CAUSE_ADDED",
        "Root cause recorded."
    );
}

function recordRemediation(req, res) {
    return recordActivity(
        req,
        res,
        "REMEDIATION_ADDED",
        "Remediation recorded."
    );
}

module.exports = {
    recordRootCause,
    recordRemediation
};
