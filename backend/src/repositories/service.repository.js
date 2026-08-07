const pool =
    require("../config/database");

/*
|--------------------------------------------------------------------------
| Get Every Service
|--------------------------------------------------------------------------
|
| Used by the monitoring engine.
|--------------------------------------------------------------------------
*/

async function getAllServices() {

    const result =
        await pool.query(
            `
            SELECT *

            FROM services

            ORDER BY id DESC;
            `
        );

    return result.rows;

}

/*
|--------------------------------------------------------------------------
| Get User Services
|--------------------------------------------------------------------------
|
| Includes the latest monitoring check for each service.
|--------------------------------------------------------------------------
*/

async function getServicesByUser(
    userId
) {

    const result =
        await pool.query(
            `
            SELECT

                s.*,

                latest_check.response_time_ms
                    AS response_time,

                latest_check.http_status
                    AS http_status,

                latest_check.checked_at
                    AS last_checked,

                latest_check.status
                    AS latest_check_status

            FROM services s

            LEFT JOIN LATERAL
            (
                SELECT

                    c.response_time_ms,

                    c.http_status,

                    c.checked_at,

                    c.status

                FROM checks c

                WHERE
                    c.service_id = s.id

                ORDER BY
                    c.checked_at DESC

                LIMIT 1

            ) latest_check
                ON TRUE

            WHERE
                s.user_id = $1

            ORDER BY
                s.id DESC;
            `,
            [
                userId
            ]
        );

    return result.rows;

}

/*
|--------------------------------------------------------------------------
| Get One Service
|--------------------------------------------------------------------------
*/

async function getServiceById(
    id
) {

    const result =
        await pool.query(
            `
            SELECT *

            FROM services

            WHERE id = $1

            LIMIT 1;
            `,
            [
                id
            ]
        );

    return result.rows[0];

}

/*
|--------------------------------------------------------------------------
| Create Service
|--------------------------------------------------------------------------
*/

async function createService(

    userId,

    name,

    url,

    serviceType,

    checkInterval

) {

    const result =
        await pool.query(
            `
            INSERT INTO services
            (
                user_id,
                name,
                url,
                service_type,
                check_interval
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5
            )

            RETURNING *;
            `,
            [
                userId,
                name,
                url,
                serviceType,
                checkInterval
            ]
        );

    return result.rows[0];

}

/*
|--------------------------------------------------------------------------
| Delete Service
|--------------------------------------------------------------------------
*/

async function deleteService(
    id
) {

    await pool.query(
        `
        DELETE FROM services

        WHERE id = $1;
        `,
        [
            id
        ]
    );

}

/*
|--------------------------------------------------------------------------
| Update Service Status
|--------------------------------------------------------------------------
*/

async function updateServiceStatus(

    id,

    status

) {

    await pool.query(
        `
        UPDATE services

        SET
            status = $2

        WHERE
            id = $1;
        `,
        [
            id,
            status
        ]
    );

}

/*
|--------------------------------------------------------------------------
| Save Monitoring Check
|--------------------------------------------------------------------------
*/

async function createCheck(

    serviceId,

    status,

    responseTime,

    httpStatus

) {

    await pool.query(
        `
        INSERT INTO checks
        (
            service_id,
            status,
            response_time_ms,
            http_status
        )

        VALUES
        (
            $1,
            $2,
            $3,
            $4
        );
        `,
        [
            serviceId,
            status,
            responseTime,
            httpStatus
        ]
    );

}

module.exports = {

    getAllServices,

    getServicesByUser,

    getServiceById,

    createService,

    deleteService,

    updateServiceStatus,

    createCheck

};