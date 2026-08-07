const metricsService =
require("../services/metrics.service");

const systemMetricsService =
require("../services/system-metrics.service");

/*
|--------------------------------------------------------------------------
| System Metrics
|--------------------------------------------------------------------------
|
| Returns live metrics from the machine currently running
| the Minerva Sentinel backend.
|
*/

async function system(req, res, next) {

    try {

        const metrics =
            await systemMetricsService.getSystemMetrics();

        res.json({

            success: true,

            data: metrics

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Save Metrics
|--------------------------------------------------------------------------
*/

async function create(req, res, next) {

    try {

        const metrics =
            await metricsService.saveMetrics(req.body);

        res.status(201).json({

            success: true,

            message:
                "Metrics received successfully.",

            data: metrics

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Latest Metrics (All Hosts)
|--------------------------------------------------------------------------
*/

async function latest(req, res, next) {

    try {

        const metrics =
            await metricsService.getLatestMetrics();

        res.json({

            success: true,

            data: metrics

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Latest Metrics (Single Host)
|--------------------------------------------------------------------------
*/

async function latestByHostname(req, res, next) {

    try {

        const metrics =
            await metricsService
                .getLatestMetricByHostname(
                    req.params.hostname
                );

        if (!metrics) {

            return res.status(404).json({

                success: false,

                message: "Host not found."

            });

        }

        res.json({

            success: true,

            data: metrics

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Metric History
|--------------------------------------------------------------------------
*/

async function history(req, res, next) {

    try {

        const hostname =
            req.query.hostname;

        const limit =
            Number(req.query.limit) || 30;

        if (!hostname) {

            return res.status(400).json({

                success: false,

                message:
                    "hostname query parameter is required."

            });

        }

        const metrics =
            await metricsService.getMetricHistory(

                hostname,

                limit

            );

        res.json({

            success: true,

            data: metrics

        });

    }

    catch (error) {

        next(error);

    }

}

module.exports = {

    system,

    create,

    latest,

    latestByHostname,

    history

};