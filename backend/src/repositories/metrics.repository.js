const pool = require("../config/database");

/*
|--------------------------------------------------------------------------
| Save Metrics
|--------------------------------------------------------------------------
*/

async function saveMetrics(metrics) {

    const result = await pool.query(

        `
        INSERT INTO metrics
        (
            hostname,
            cpu_usage,
            memory_usage,
            disk_usage,
            uptime,
            platform,
            architecture
        )

        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7
        )

        RETURNING *;
        `,

        [

            metrics.hostname,

            metrics.cpu,

            metrics.memory,

            metrics.disk,

            metrics.uptime,

            metrics.platform,

            metrics.architecture

        ]

    );

    return result.rows[0];

}

/*
|--------------------------------------------------------------------------
| Latest Metrics For Every Host
|--------------------------------------------------------------------------
*/

async function getLatestMetrics() {

    const result = await pool.query(

        `
        SELECT DISTINCT ON (hostname)

            id,

            hostname,

            cpu_usage,

            memory_usage,

            disk_usage,

            uptime,

            platform,

            architecture,

            created_at

        FROM metrics

        ORDER BY

            hostname,

            created_at DESC;
        `

    );

    return result.rows;

}

/*
|--------------------------------------------------------------------------
| Latest Metrics For One Host
|--------------------------------------------------------------------------
*/

async function getLatestMetricByHostname(hostname) {

    const result = await pool.query(

        `
        SELECT *

        FROM metrics

        WHERE hostname = $1

        ORDER BY created_at DESC

        LIMIT 1;
        `,

        [

            hostname

        ]

    );

    return result.rows[0];

}

/*
|--------------------------------------------------------------------------
| Metric History
|--------------------------------------------------------------------------
*/

async function getMetricHistory(

    hostname,

    limit = 30

) {

    const result = await pool.query(

        `
        SELECT

            cpu_usage,

            memory_usage,

            disk_usage,

            uptime,

            created_at

        FROM metrics

        WHERE hostname = $1

        ORDER BY created_at DESC

        LIMIT $2;
        `,

        [

            hostname,

            limit

        ]

    );

    /*
    Return oldest → newest
    so Chart.js draws correctly.
    */

    return result.rows.reverse();

}

module.exports = {

    saveMetrics,

    getLatestMetrics,

    getLatestMetricByHostname,

    getMetricHistory

};