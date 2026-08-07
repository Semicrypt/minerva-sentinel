const hostRepository =
    require("../repositories/host.repository");

/*
|--------------------------------------------------------------------------
| Host Health Configuration
|--------------------------------------------------------------------------
*/

const WARNING_THRESHOLD = 95;

const OFFLINE_THRESHOLD_SECONDS = 30;

/*
|--------------------------------------------------------------------------
| Determine Resource Status
|--------------------------------------------------------------------------
|
| This is used whenever a host sends a fresh metric.
|
| A fresh host can either be:
|
| ONLINE
| WARNING
|
| OFFLINE is handled separately by the heartbeat checker.
|--------------------------------------------------------------------------
*/

function determineResourceStatus(metrics) {

    const cpu =
        Number(
            metrics.cpu || 0
        );

    const memory =
        Number(
            metrics.memory || 0
        );

    const disk =
        Number(
            metrics.disk || 0
        );

    if (
        cpu >= WARNING_THRESHOLD ||
        memory >= WARNING_THRESHOLD ||
        disk >= WARNING_THRESHOLD
    ) {

        return "WARNING";

    }

    return "ONLINE";

}

/*
|--------------------------------------------------------------------------
| Refresh Offline Hosts
|--------------------------------------------------------------------------
|
| Hosts that have stopped reporting are marked OFFLINE.
|--------------------------------------------------------------------------
*/

async function refreshHostStatuses() {

    try {

        const offlineHosts =
            await hostRepository.markOfflineHosts(
                OFFLINE_THRESHOLD_SECONDS
            );

        if (
            offlineHosts.length > 0
        ) {

            console.log(
                `⚠️ Host health | ${offlineHosts.length} host(s) marked OFFLINE`
            );

        }

        return offlineHosts;

    }

    catch (error) {

        console.error(
            "❌ Host health check failed:",
            error.message
        );

        return [];

    }

}

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

function getHostHealthConfig() {

    return {

        warningThreshold:
            WARNING_THRESHOLD,

        offlineThresholdSeconds:
            OFFLINE_THRESHOLD_SECONDS

    };

}

module.exports = {

    determineResourceStatus,

    refreshHostStatuses,

    getHostHealthConfig

};
