const axios =
    require("axios");

const {
    DOCKER_SNAPSHOT_URL,
    MINERVA_AGENT_KEY
} =
    require("./config");

async function sendDockerSnapshot(
    snapshot
) {
    if (!MINERVA_AGENT_KEY) {
        throw new Error(
            "MINERVA_AGENT_KEY is not configured."
        );
    }

    try {
        const response =
            await axios.post(
                DOCKER_SNAPSHOT_URL,
                snapshot,
                {
                    headers: {
                        "Content-Type":
                            "application/json",

                        "X-Minerva-Agent-Key":
                            MINERVA_AGENT_KEY
                    },

                    timeout: 30000,

                    maxBodyLength:
                        10 * 1024 * 1024
                }
            );

        return response.data;
    } catch (error) {
        const serverMessage =
            error.response?.data?.message;

        const status =
            error.response?.status;

        if (status) {
            throw new Error(
                `Snapshot upload failed with HTTP ${status}: ${
                    serverMessage ||
                    "Unknown server error."
                }`
            );
        }

        throw new Error(
            `Snapshot upload failed: ${error.message}`
        );
    }
}

module.exports = {
    sendDockerSnapshot
};