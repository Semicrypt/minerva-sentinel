const pool =
    require("../config/database");

/*
|--------------------------------------------------------------------------
| Create Log
|--------------------------------------------------------------------------
*/

async function createLog(log) {

    const result =
        await pool.query(
            `
            INSERT INTO logs
            (
                level,
                source,
                message,
                user_id,
                service_id,
                metadata
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
            )

            RETURNING *;
            `,
            [
                log.level,
                log.source,
                log.message,
                log.userId || null,
                log.serviceId || null,
                log.metadata || {}
            ]
        );

    return result.rows[0];

}

/*
|--------------------------------------------------------------------------
| Get Logs
|--------------------------------------------------------------------------
*/

async function getLogs(options = {}) {

    const conditions = [];
    const values = [];

    let parameterIndex = 1;

    /*
    |--------------------------------------------------------------------------
    | Severity
    |--------------------------------------------------------------------------
    */

    if (options.level) {

        conditions.push(
            `UPPER(level) = UPPER($${parameterIndex})`
        );

        values.push(
            options.level
        );

        parameterIndex++;

    }

    /*
    |--------------------------------------------------------------------------
    | Source
    |--------------------------------------------------------------------------
    */

    if (options.source) {

        conditions.push(
            `source ILIKE $${parameterIndex}`
        );

        values.push(
            `%${options.source}%`
        );

        parameterIndex++;

    }

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (options.search) {

        conditions.push(
            `
            (
                message ILIKE $${parameterIndex}
                OR
                source ILIKE $${parameterIndex}
            )
            `
        );

        values.push(
            `%${options.search}%`
        );

        parameterIndex++;

    }

    /*
    |--------------------------------------------------------------------------
    | Time Range
    |--------------------------------------------------------------------------
    |
    | Time comparison happens directly inside PostgreSQL.
    |--------------------------------------------------------------------------
    */

    switch (
        options.timeRange
    ) {

        case "1h":

            conditions.push(
                "created_at >= NOW() - INTERVAL '1 hour'"
            );

            break;

        case "6h":

            conditions.push(
                "created_at >= NOW() - INTERVAL '6 hours'"
            );

            break;

        case "24h":

            conditions.push(
                "created_at >= NOW() - INTERVAL '24 hours'"
            );

            break;

        case "7d":

            conditions.push(
                "created_at >= NOW() - INTERVAL '7 days'"
            );

            break;

        default:

            break;

    }

    /*
    |--------------------------------------------------------------------------
    | Limit
    |--------------------------------------------------------------------------
    */

    const limit =
        Math.min(
            Math.max(
                Number(options.limit) || 100,
                1
            ),
            500
        );

    values.push(
        limit
    );

    /*
    |--------------------------------------------------------------------------
    | Query
    |--------------------------------------------------------------------------
    */

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    const result =
        await pool.query(
            `
            SELECT
                id,
                level,
                source,
                message,
                user_id,
                service_id,
                metadata,
                created_at

            FROM logs

            ${whereClause}

            ORDER BY
                created_at DESC,
                id DESC

            LIMIT $${parameterIndex};
            `,
            values
        );

    return result.rows;

}

/*
|--------------------------------------------------------------------------
| Get Log Statistics
|--------------------------------------------------------------------------
*/

async function getLogStats() {

    const result =
        await pool.query(
            `
            SELECT

                COUNT(*)::integer
                    AS total,

                COUNT(*) FILTER
                (
                    WHERE UPPER(level) = 'INFO'
                )::integer
                    AS info,

                COUNT(*) FILTER
                (
                    WHERE UPPER(level) = 'WARNING'
                )::integer
                    AS warnings,

                COUNT(*) FILTER
                (
                    WHERE UPPER(level) = 'ERROR'
                )::integer
                    AS errors,

                COUNT(*) FILTER
                (
                    WHERE UPPER(level) = 'CRITICAL'
                )::integer
                    AS critical,

                COUNT(*) FILTER
                (
                    WHERE created_at >= NOW() - INTERVAL '1 hour'
                )::integer
                    AS last_hour,

                COUNT(*) FILTER
                (
                    WHERE created_at >= NOW() - INTERVAL '1 minute'
                )::integer
                    AS last_minute

            FROM logs;
            `
        );

    return result.rows[0];

}

/*
|--------------------------------------------------------------------------
| Get Log Sources
|--------------------------------------------------------------------------
*/

async function getLogSources() {

    const result =
        await pool.query(
            `
            SELECT
                source,
                COUNT(*)::integer AS count

            FROM logs

            GROUP BY
                source

            ORDER BY
                count DESC,
                source ASC;
            `
        );

    return result.rows;

}

module.exports = {

    createLog,

    getLogs,

    getLogStats,

    getLogSources

};