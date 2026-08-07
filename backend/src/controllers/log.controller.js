const logService =
    require("../services/log.service");

/*
|--------------------------------------------------------------------------
| Get Logs
|--------------------------------------------------------------------------
*/

async function getLogs(
    req,
    res
) {

    try {

        const logs =
            await logService.getLogs(
                {

                    level:
                        req.query.level,

                    source:
                        req.query.source,

                    search:
                        req.query.search,

                    timeRange:
                        req.query.timeRange,

                    limit:
                        req.query.limit

                }
            );

        return res.json(
            {

                success:
                    true,

                count:
                    logs.length,

                data:
                    logs

            }
        );

    }

    catch (error) {

        console.error(
            "Unable to load logs:",
            error
        );

        return res.status(500).json(
            {

                success:
                    false,

                message:
                    "Unable to load logs."

            }
        );

    }

}

/*
|--------------------------------------------------------------------------
| Get Statistics
|--------------------------------------------------------------------------
*/

async function getStats(
    req,
    res
) {

    try {

        const stats =
            await logService.getLogStats();

        return res.json(
            {

                success:
                    true,

                data:
                    stats

            }
        );

    }

    catch (error) {

        console.error(
            "Unable to load log statistics:",
            error
        );

        return res.status(500).json(
            {

                success:
                    false,

                message:
                    "Unable to load log statistics."

            }
        );

    }

}

/*
|--------------------------------------------------------------------------
| Get Sources
|--------------------------------------------------------------------------
*/

async function getSources(
    req,
    res
) {

    try {

        const sources =
            await logService.getLogSources();

        return res.json(
            {

                success:
                    true,

                data:
                    sources

            }
        );

    }

    catch (error) {

        console.error(
            "Unable to load log sources:",
            error
        );

        return res.status(500).json(
            {

                success:
                    false,

                message:
                    "Unable to load log sources."

            }
        );

    }

}

module.exports = {

    getLogs,

    getStats,

    getSources

};