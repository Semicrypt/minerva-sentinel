const pool =
    require("../config/database");

/*
|--------------------------------------------------------------------------
| Get Recent Service History
|--------------------------------------------------------------------------
|
| Fetch the newest checks first, limit them, then return them oldest-to-newest
| so charts and timelines display naturally.
|--------------------------------------------------------------------------
*/

async function getServiceHistory(
    serviceId
) {

    const result =
        await pool.query(

            `
            SELECT
                status,
                response_time_ms,
                http_status,
                checked_at

            FROM
            (
                SELECT
                    status,
                    response_time_ms,
                    http_status,
                    checked_at

                FROM checks

                WHERE service_id = $1

                ORDER BY checked_at DESC

                LIMIT 50
            ) recent_checks

            ORDER BY checked_at ASC;
            `,

            [
                serviceId
            ]

        );

    return result.rows;

}

module.exports = {

    getServiceHistory

};