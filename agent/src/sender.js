const axios =
    require("axios");

const {
    DOCKER_SNAPSHOT_URL,
    HOST_METRICS_URL,
    MINERVA_AGENT_KEY
} =
    require("./config");

function requireAgentKey() {
    if (!MINERVA_AGENT_KEY) {
        throw new Error(
            "MINERVA_AGENT_KEY is not configured."
        );
    }
}

function createRequestOptions({
    timeout,
    maxBodyLength
}) {
    return {
        headers: {
            "Content-Type":
                "application/json",

            "X-Minerva-Agent-Key":
                MINERVA_AGENT_KEY
        },

        timeout,

        maxBodyLength
    };
}

function createUploadError(
    error,
    uploadType
) {
    const serverMessage =
        error.response?.data?.message;

    const status =
        error.response?.status;

    if (status) {
        return new Error(
            `${uploadType} upload failed with HTTP ${status}: ${
                serverMessage ||
                "Unknown server error."
            }`
        );
    }

    return new Error(
        `${uploadType} upload failed: ${error.message}`
    );
}

/*
|--------------------------------------------------------------------------
| Docker Snapshot
|--------------------------------------------------------------------------
*/

async function sendDockerSnapshot(
    snapshot
) {
    requireAgentKey();

    try {
        const response =
            await axios.post(
                DOCKER_SNAPSHOT_URL,
                snapshot,
                createRequestOptions({
                    timeout: 30000,
                    maxBodyLength:
                        10 * 1024 * 1024
                })
            );

        return response.data;
    } catch (error) {
        throw createUploadError(
            error,
            "Docker snapshot"
        );
    }
}

/*
|--------------------------------------------------------------------------
| Host Metrics
|--------------------------------------------------------------------------
*/

async function sendHostMetrics(
    metrics
) {
    requireAgentKey();

    try {
        const response =
            await axios.post(
                HOST_METRICS_URL,
                metrics,
                createRequestOptions({
                    timeout: 15000,
                    maxBodyLength:
                        256 * 1024
                })
            );

        return response.data;
    } catch (error) {
        throw createUploadError(
            error,
            "Host metrics"
        );
    }
}

module.exports = {
    sendDockerSnapshot,
    sendHostMetrics
};