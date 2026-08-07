const ValidationError =
    require("../errors/ValidationError");

const metricsRepository =
    require("../repositories/metrics.repository");

const hostRepository =
    require("../repositories/host.repository");

const {
    determineResourceStatus
} =
    require("./host-health.service");

/*
|--------------------------------------------------------------------------
| Save Metrics
|--------------------------------------------------------------------------
*/

async function saveMetrics(metrics) {

    if (

        metrics.cpu === undefined ||

        metrics.memory === undefined ||

        metrics.disk === undefined

    ) {

        throw new ValidationError(
            "Incomplete metrics received."
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Determine Host Health
    |--------------------------------------------------------------------------
    |
    | Any incoming metric means the machine is currently reachable.
    |
    | Its state is therefore either ONLINE or WARNING.
    |--------------------------------------------------------------------------
    */

    const status =
        determineResourceStatus(
            metrics
        );

    const hostMetrics = {

        ...metrics,

        status

    };

    /*
    |--------------------------------------------------------------------------
    | Save Historical Metrics
    |--------------------------------------------------------------------------
    */

    const savedMetrics =
        await metricsRepository.saveMetrics(
            metrics
        );

    /*
    |--------------------------------------------------------------------------
    | Update Current Host
    |--------------------------------------------------------------------------
    */

    await hostRepository.updateHost(
        hostMetrics
    );

    return savedMetrics;

}

/*
|--------------------------------------------------------------------------
| Latest Metrics - All Hosts
|--------------------------------------------------------------------------
*/

async function getLatestMetrics() {

    return metricsRepository.getLatestMetrics();

}

/*
|--------------------------------------------------------------------------
| Latest Metrics - Single Host
|--------------------------------------------------------------------------
*/

async function getLatestMetricByHostname(
    hostname
) {

    return metricsRepository.getLatestMetricByHostname(
        hostname
    );

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

    return metricsRepository.getMetricHistory(

        hostname,

        limit

    );

}

module.exports = {

    saveMetrics,

    getLatestMetrics,

    getLatestMetricByHostname,

    getMetricHistory

};