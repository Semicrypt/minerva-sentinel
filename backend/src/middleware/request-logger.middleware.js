const logService =
    require("../services/log.service");

/*
|--------------------------------------------------------------------------
| Determine Severity
|--------------------------------------------------------------------------
*/

function determineLevel(
    statusCode
) {

    if (
        statusCode >= 500
    ) {

        return "ERROR";

    }

    if (
        statusCode >= 400
    ) {

        return "WARNING";

    }

    return "INFO";

}

/*
|--------------------------------------------------------------------------
| High-Frequency Request Detection
|--------------------------------------------------------------------------
|
| Successful polling/telemetry requests are skipped to avoid flooding
| PostgreSQL.
|
| IMPORTANT:
| Errors on these same routes are still logged because the request logger
| only skips them when the response status is below 400.
|--------------------------------------------------------------------------
*/

function isHighFrequencyRequest(
    req
) {

    const path =
        req.originalUrl;

    /*
    |--------------------------------------------------------------------------
    | Metric Ingestion
    |--------------------------------------------------------------------------
    */

    if (
        req.method === "POST" &&
        path.startsWith(
            "/api/metrics"
        )
    ) {

        return true;

    }

    /*
    |--------------------------------------------------------------------------
    | System Metrics Polling
    |--------------------------------------------------------------------------
    */

    if (
        req.method === "GET" &&
        path.startsWith(
            "/api/metrics/system"
        )
    ) {

        return true;

    }

    /*
    |--------------------------------------------------------------------------
    | Metric History Polling
    |--------------------------------------------------------------------------
    */

    if (
        req.method === "GET" &&
        path.startsWith(
            "/api/metrics/history"
        )
    ) {

        return true;

    }

    /*
    |--------------------------------------------------------------------------
    | Host Polling
    |--------------------------------------------------------------------------
    */

    if (
        req.method === "GET" &&
        path.startsWith(
            "/api/hosts"
        )
    ) {

        return true;

    }

    /*
    |--------------------------------------------------------------------------
    | Service Check History Polling
    |--------------------------------------------------------------------------
    */

    if (
        req.method === "GET" &&
        path.startsWith(
            "/api/checks/"
        ) &&
        path.includes(
            "/history"
        )
    ) {

        return true;

    }

    /*
    |--------------------------------------------------------------------------
    | Service Status Polling
    |--------------------------------------------------------------------------
    |
    | The Services and Observability pages regularly refresh this endpoint.
    | Successful 200/304 requests do not need to become log entries.
    |--------------------------------------------------------------------------
    */

    if (
        req.method === "GET" &&
        (
            path === "/api/services" ||
            path.startsWith(
                "/api/services?"
            )
        )
    ) {

        return true;

    }

    return false;

}

/*
|--------------------------------------------------------------------------
| Request Logger
|--------------------------------------------------------------------------
*/

function requestLogger(
    req,
    res,
    next
) {

    const startedAt =
        process.hrtime.bigint();

    res.on(
        "finish",
        () => {

            /*
            |--------------------------------------------------------------------------
            | Never Log Log-Reader Requests
            |--------------------------------------------------------------------------
            |
            | Otherwise opening the Logs page would generate logs about reading
            | the logs, creating unnecessary self-generated traffic.
            |--------------------------------------------------------------------------
            */

            if (
                req.originalUrl.startsWith(
                    "/api/logs"
                )
            ) {

                return;

            }

            const finishedAt =
                process.hrtime.bigint();

            const durationMs =
                Number(
                    finishedAt -
                    startedAt
                ) /
                1_000_000;

            const statusCode =
                res.statusCode;

            /*
            |--------------------------------------------------------------------------
            | Skip Successful High-Frequency Traffic
            |--------------------------------------------------------------------------
            |
            | 2xx and 3xx polling requests are ignored.
            |
            | 4xx and 5xx responses continue through the logger so failures
            | remain visible.
            |--------------------------------------------------------------------------
            */

            if (
                statusCode < 400 &&
                isHighFrequencyRequest(
                    req
                )
            ) {

                return;

            }

            const level =
                determineLevel(
                    statusCode
                );

            const method =
                req.method;

            const path =
                req.originalUrl;

            const message =
                `${method} ${path} -> ${statusCode} (${durationMs.toFixed(1)} ms)`;

            /*
            |--------------------------------------------------------------------------
            | Store Log
            |--------------------------------------------------------------------------
            */

            logService.createLog(
                {

                    level,

                    source:
                        "HTTP API",

                    message,

                    userId:
                        req.user?.id ||
                        null,

                    metadata:
                        {

                            method,

                            path,

                            statusCode,

                            durationMs:
                                Number(
                                    durationMs.toFixed(
                                        2
                                    )
                                ),

                            ip:
                                req.ip ||
                                null,

                            userAgent:
                                req.headers[
                                    "user-agent"
                                ] ||
                                null

                        }

                }
            )
                .catch(
                    error => {

                        console.error(
                            "❌ Request logging failed:",
                            error.message
                        );

                    }
                );

        }
    );

    next();

}

module.exports =
    requestLogger;