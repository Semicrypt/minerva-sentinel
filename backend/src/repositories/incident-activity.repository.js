const pool = require("../config/database");

async function createIncidentActivity({
    incidentId,
    userId,
    eventType,
    details
}) {
    const result = await pool.query(
        `
        INSERT INTO incident_events
        (
            incident_id,
            event_type,
            actor_user_id,
            details
        )
        SELECT
            incident.id,
            $3,
            $2,
            $4
        FROM incidents AS incident
        JOIN services AS service
            ON service.id =
                incident.service_id
        WHERE incident.id = $1
        AND service.user_id = $2
        RETURNING
            id,
            incident_id AS "incidentId",
            event_type AS "eventType",
            actor_user_id AS "actorUserId",
            details,
            created_at AS "createdAt"
        `,
        [
            incidentId,
            userId,
            eventType,
            details
        ]
    );

    return result.rows[0];
}

module.exports = {
    createIncidentActivity
};
