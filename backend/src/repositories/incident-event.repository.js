const pool = require("../config/database");

async function getIncidentTimeline(userId) {
    const result = await pool.query(
        `
        SELECT
            event.id,
            event.incident_id AS "incidentId",
            event.event_type AS "eventType",
            event.details,
            event.metadata,
            event.actor_user_id AS "actorUserId",
            event.created_at AS "createdAt",
            incident.title AS "incidentTitle",
            incident.description AS "incidentDescription",
            incident.status AS "incidentStatus",
            service.id AS "serviceId",
            service.name AS "serviceName"
        FROM incident_events AS event
        JOIN incidents AS incident
            ON incident.id = event.incident_id
        JOIN services AS service
            ON service.id = incident.service_id
        WHERE service.user_id = $1
        ORDER BY
            event.created_at DESC,
            event.id DESC
        LIMIT 100
        `,
        [userId]
    );

    return result.rows;
}

module.exports = {
    getIncidentTimeline
};
