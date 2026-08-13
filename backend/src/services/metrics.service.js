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

function validateMetrics(metrics) {
    if (
        metrics.cpu === undefined ||
        metrics.memory === undefined ||
        metrics.disk === undefined
    ) {
        throw new ValidationError(
            "Incomplete metrics received."
        );
    }
}

/*
|--------------------------------------------------------------------------
| Save Agent Metrics
|--------------------------------------------------------------------------
|
| Genuine monitoring-agent metrics are saved to history and update the
| Infrastructure host inventory.
|--------------------------------------------------------------------------
*/

async function saveMetrics(metrics) {
    validateMetrics(metrics);

    const status =
        determineResourceStatus(
            metrics
        );

    const hostMetrics = {
        ...metrics,
        status
    };

    const savedMetrics =
        await metricsRepository.saveMetrics(
            metrics
        );

    await hostRepository.updateHost(
        hostMetrics
    );

    return savedMetrics;
}

/*
|--------------------------------------------------------------------------
| Save Internal System Metrics
|--------------------------------------------------------------------------
|
| Minerva Sentinel monitors the machine/container running its backend.
| These values belong to dashboard history, but the backend container must
| not be registered as an Infrastructure host.
|--------------------------------------------------------------------------
*/

async function saveMetricsHistory(metrics) {
    validateMetrics(metrics);

    return metricsRepository.saveMetrics(
        metrics
    );
}

async function getLatestMetrics() {
    return metricsRepository
        .getLatestMetrics();
}

async function getLatestMetricByHostname(
    hostname
) {
    return metricsRepository
        .getLatestMetricByHostname(
            hostname
        );
}

async function getMetricHistory(
    hostname,
    limit = 30
) {
    return metricsRepository
        .getMetricHistory(
            hostname,
            limit
        );
}

module.exports = {
    saveMetrics,
    saveMetricsHistory,
    getLatestMetrics,
    getLatestMetricByHostname,
    getMetricHistory
};