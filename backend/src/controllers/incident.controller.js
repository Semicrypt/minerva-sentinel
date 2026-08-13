const repository = require(
    "../repositories/incident.repository"
);

const eventRepository = require(
    "../repositories/incident-event.repository"
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

async function getAllIncidents(req, res) {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated user is invalid."
            });
        }

        const incidents =
            await repository.getAllIncidents(
                userId
            );

        return res.json({
            success: true,
            data: incidents
        });
    } catch (error) {
        console.error(
            "Unable to load incidents:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load incidents."
        });
    }
}

async function getIncidentTimeline(req, res) {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated user is invalid."
            });
        }

        const events =
            await eventRepository
                .getIncidentTimeline(userId);

        return res.json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error(
            "Unable to load incident timeline:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load incident timeline."
        });
    }
}

async function acknowledgeAllIncidents(
    req,
    res
) {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated user is invalid."
            });
        }

        const incidents =
            await repository
                .acknowledgeAllIncidents(
                    userId
                );

        return res.json({
            success: true,
            message:
                incidents.length > 0
                    ? `${incidents.length} incident(s) acknowledged.`
                    : "There are no open incidents to acknowledge.",
            data: {
                acknowledgedCount:
                    incidents.length,
                incidents
            }
        });
    } catch (error) {
        console.error(
            "Unable to acknowledge incidents:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to acknowledge incidents."
        });
    }
}

async function acknowledgeIncident(
    req,
    res
) {
    try {
        const userId = getUserId(req);
        const incidentId =
            getIncidentId(req);

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

        const incident =
            await repository
                .acknowledgeIncident(
                    incidentId,
                    userId
                );

        if (!incident) {
            return res.status(404).json({
                success: false,
                message:
                    "Open incident was not found."
            });
        }

        return res.json({
            success: true,
            message:
                "Incident acknowledged.",
            data: incident
        });
    } catch (error) {
        console.error(
            "Unable to acknowledge incident:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to acknowledge incident."
        });
    }
}

async function resolveIncident(req, res) {
    try {
        const userId = getUserId(req);
        const incidentId =
            getIncidentId(req);

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

        const incident =
            await repository
                .resolveIncidentById(
                    incidentId,
                    userId
                );

        if (!incident) {
            return res.status(404).json({
                success: false,
                message:
                    "Active incident was not found."
            });
        }

        return res.json({
            success: true,
            message:
                "Incident resolved.",
            data: incident
        });
    } catch (error) {
        console.error(
            "Unable to resolve incident:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to resolve incident."
        });
    }
}

module.exports = {
    getAllIncidents,
    getIncidentTimeline,
    acknowledgeAllIncidents,
    acknowledgeIncident,
    resolveIncident
};