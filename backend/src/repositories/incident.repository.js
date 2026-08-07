const pool = require("../config/database");

/**
 * Create a new incident
 */
async function createIncident(serviceId, title, description) {

    const result = await pool.query(
        `
        INSERT INTO incidents
        (
            service_id,
            title,
            description
        )
        VALUES
        ($1,$2,$3)
        RETURNING *
        `,
        [
            serviceId,
            title,
            description
        ]
    );

    return result.rows[0];

}

/**
 * Check if there is an open incident
 */
async function getOpenIncident(serviceId) {

    const result = await pool.query(
        `
        SELECT *
        FROM incidents
        WHERE service_id = $1
        AND status = 'OPEN'
        LIMIT 1
        `,
        [serviceId]
    );

    return result.rows[0];

}

/**
 * Resolve an incident
 */
async function resolveIncident(serviceId) {

    await pool.query(
        `
        UPDATE incidents
        SET
            status = 'RESOLVED',
            resolved_at = CURRENT_TIMESTAMP
        WHERE
            service_id = $1
        AND
            status = 'OPEN'
        `,
        [serviceId]
    );

}

/**
 * Get all incidents
 */
async function getAllIncidents() {

    const result = await pool.query(
        `
        SELECT
            incidents.*,
            services.name
        FROM incidents
        JOIN services
        ON incidents.service_id = services.id
        ORDER BY created_at DESC
        `
    );

    return result.rows;

}

module.exports = {

    createIncident,
    getOpenIncident,
    resolveIncident,
    getAllIncidents

};