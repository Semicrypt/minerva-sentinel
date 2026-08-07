const pool = require("../config/database");

async function getSummary() {

    const totalResult = await pool.query(
        `SELECT COUNT(*) FROM services`
    );

    const onlineResult = await pool.query(
        `SELECT COUNT(*) FROM services WHERE status='UP'`
    );

    const offlineResult = await pool.query(
        `SELECT COUNT(*) FROM services WHERE status='DOWN'`
    );

    const responseResult = await pool.query(`
        SELECT AVG(response_time_ms) AS average
        FROM checks
        WHERE response_time_ms > 0
    `);

    const uptimeResult = await pool.query(`
        SELECT
        ROUND(
            (
                COUNT(*) FILTER (WHERE status='UP')::decimal
                /
                NULLIF(COUNT(*),0)
            ) * 100,
            2
        ) AS uptime
        FROM checks
    `);

    return {

        totalServices:
            Number(totalResult.rows[0].count),

        onlineServices:
            Number(onlineResult.rows[0].count),

        offlineServices:
            Number(offlineResult.rows[0].count),

        averageResponse:
            Math.round(
                Number(responseResult.rows[0].average || 0)
            ),

        uptime:
            Number(
                uptimeResult.rows[0].uptime || 0
            )

    };

}

module.exports = {

    getSummary

};