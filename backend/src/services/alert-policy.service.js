const {
    getHostHealthConfig
} = require("./host-health.service");

function getAlertPolicies() {
    const {
        warningThreshold,
        offlineThresholdSeconds
    } = getHostHealthConfig();

    return [
        {
            id: "host-resource-warning",
            name: "Host Resource Warning",
            category: "HOST_RESOURCES",
            condition:
                `CPU, memory or disk usage reaches ${warningThreshold}%`,
            threshold: warningThreshold,
            unit: "percent",
            status: "ACTIVE"
        },
        {
            id: "host-offline",
            name: "Host Offline",
            category: "HOST_HEARTBEAT",
            condition:
                `No host metrics received for ${offlineThresholdSeconds} seconds`,
            threshold:
                offlineThresholdSeconds,
            unit: "seconds",
            status: "ACTIVE"
        },
        {
            id: "service-availability",
            name: "Service Availability",
            category: "SERVICE_HEALTH",
            condition:
                "A monitored service health check reports DOWN",
            threshold: "DOWN",
            unit: "status",
            status: "ACTIVE"
        }
    ];
}

module.exports = {
    getAlertPolicies
};
