const pool = require("../config/database");

async function createIncident(
    serviceId,
    title,
    description
) {
    const result = await pool.query(
        `
        WITH created_incident AS (
            INSERT INTO incidents
            (
                service_id,
                title,
                description
            )
            VALUES ($1, $2, $3)
            RETURNING *
        ),
        created_event AS (
            INSERT INTO incident_events
            (
                incident_id,
                event_type,
                details,
                created_at
            )
            SELECT
                created_incident.id,
                'DETECTED',
                NULLIF(
                    BTRIM(created_incident.description),
                    ''
                ),
                created_incident.created_at
            FROM created_incident
            RETURNING incident_id
        )
        SELECT created_incident.*
        FROM created_incident
        JOIN created_event
            ON created_event.incident_id =
                created_incident.id
        `,
        [serviceId, title, description]
    );

    return result.rows[0];
}

async function getOpenIncident(serviceId) {
    const result = await pool.query(
        `
        SELECT *
        FROM incidents
        WHERE service_id = $1
        AND status IN ('OPEN', 'ACKNOWLEDGED')
        LIMIT 1
        `,
        [serviceId]
    );

    return result.rows[0];
}

async function resolveIncident(serviceId) {
    const result = await pool.query(
        `
        WITH resolved_incidents AS (
            UPDATE incidents
            SET
                status = 'RESOLVED',
                resolved_at = CURRENT_TIMESTAMP
            WHERE service_id = $1
            AND status IN ('OPEN', 'ACKNOWLEDGED')
            RETURNING incidents.*
        ),
        created_events AS (
            INSERT INTO incident_events
            (
                incident_id,
                event_type,
                created_at
            )
            SELECT
                resolved_incidents.id,
                'RESOLVED',
                resolved_incidents.resolved_at
            FROM resolved_incidents
            RETURNING incident_id
        )
        SELECT resolved_incidents.*
        FROM resolved_incidents
        JOIN created_events
            ON created_events.incident_id =
                resolved_incidents.id
        `,
        [serviceId]
    );

    return result.rows;
}

async function getAllIncidents(userId) {
    const result = await pool.query(
        `
        SELECT
            incidents.*,
            services.name
        FROM incidents
        JOIN services
            ON incidents.service_id = services.id
        WHERE services.user_id = $1
        ORDER BY incidents.created_at DESC
        `,
        [userId]
    );

    return result.rows;
}

async function acknowledgeAllIncidents(userId) {
    const result = await pool.query(
        `
        WITH acknowledged_incidents AS (
            UPDATE incidents
            SET status = 'ACKNOWLEDGED'
            FROM services
            WHERE incidents.service_id = services.id
            AND services.user_id = $1
            AND incidents.status = 'OPEN'
            RETURNING incidents.*
        ),
        created_events AS (
            INSERT INTO incident_events
            (
                incident_id,
                event_type,
                actor_user_id
            )
            SELECT
                acknowledged_incidents.id,
                'ACKNOWLEDGED',
                $1
            FROM acknowledged_incidents
            RETURNING incident_id
        )
        SELECT acknowledged_incidents.*
        FROM acknowledged_incidents
        JOIN created_events
            ON created_events.incident_id =
                acknowledged_incidents.id
        `,
        [userId]
    );

    return result.rows;
}

async function acknowledgeIncident(
    incidentId,
    userId
) {
    const result = await pool.query(
        `
        WITH acknowledged_incident AS (
            UPDATE incidents
            SET status = 'ACKNOWLEDGED'
            FROM services
            WHERE incidents.id = $1
            AND incidents.service_id = services.id
            AND services.user_id = $2
            AND incidents.status = 'OPEN'
            RETURNING incidents.*
        ),
        created_event AS (
            INSERT INTO incident_events
            (
                incident_id,
                event_type,
                actor_user_id
            )
            SELECT
                acknowledged_incident.id,
                'ACKNOWLEDGED',
                $2
            FROM acknowledged_incident
            RETURNING incident_id
        )
        SELECT acknowledged_incident.*
        FROM acknowledged_incident
        JOIN created_event
            ON created_event.incident_id =
                acknowledged_incident.id
        `,
        [incidentId, userId]
    );

    return result.rows[0];
}

async function resolveIncidentById(
    incidentId,
    userId
) {
    const result = await pool.query(
        `
        WITH resolved_incident AS (
            UPDATE incidents
            SET
                status = 'RESOLVED',
                resolved_at = CURRENT_TIMESTAMP
            FROM services
            WHERE incidents.id = $1
            AND incidents.service_id = services.id
            AND services.user_id = $2
            AND incidents.status IN (
                'OPEN',
                'ACKNOWLEDGED'
            )
            RETURNING incidents.*
        ),
        created_event AS (
            INSERT INTO incident_events
            (
                incident_id,
                event_type,
                actor_user_id,
                created_at
            )
            SELECT
                resolved_incident.id,
                'RESOLVED',
                $2,
                resolved_incident.resolved_at
            FROM resolved_incident
            RETURNING incident_id
        )
        SELECT resolved_incident.*
        FROM resolved_incident
        JOIN created_event
            ON created_event.incident_id =
                resolved_incident.id
        `,
        [incidentId, userId]
    );

    return result.rows[0];
}

module.exports = {
    createIncident,
    getOpenIncident,
    resolveIncident,
    getAllIncidents,
    acknowledgeAllIncidents,
    acknowledgeIncident,
    resolveIncidentById
};