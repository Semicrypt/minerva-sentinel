require("dotenv").config();

function removeTrailingSlash(value) {
    return String(value || "")
        .trim()
        .replace(/\/+$/, "");
}

function normalizeAgentMode(value) {
    const mode =
        String(value || "docker")
            .trim()
            .toLowerCase();

    if (
        mode !== "docker" &&
        mode !== "host"
    ) {
        throw new Error(
            "MINERVA_AGENT_MODE must be either docker or host."
        );
    }

    return mode;
}

const MINERVA_API_URL =
    removeTrailingSlash(
        process.env.MINERVA_API_URL ||
        "http://localhost:5000/api"
    );

const MINERVA_AGENT_KEY =
    String(
        process.env.MINERVA_AGENT_KEY ||
        ""
    ).trim();

const MINERVA_AGENT_MODE =
    normalizeAgentMode(
        process.env.MINERVA_AGENT_MODE
    );

const MINERVA_HOSTNAME =
    String(
        process.env.MINERVA_HOSTNAME ||
        ""
    ).trim();

const MINERVA_HOST_ROOT =
    String(
        process.env.MINERVA_HOST_ROOT ||
        "/hostfs"
    ).trim();

const requestedInterval =
    Number(
        process.env.INTERVAL
    );

const INTERVAL =
    Number.isFinite(requestedInterval) &&
    requestedInterval >= 10000
        ? requestedInterval
        : 30000;

const DOCKER_SNAPSHOT_URL =
    `${MINERVA_API_URL}/docker/agent/snapshot`;

const HOST_METRICS_URL =
    `${MINERVA_API_URL}/hosts/agent/metrics`;

module.exports = {
    MINERVA_API_URL,
    MINERVA_AGENT_KEY,
    MINERVA_AGENT_MODE,
    MINERVA_HOSTNAME,
    MINERVA_HOST_ROOT,
    DOCKER_SNAPSHOT_URL,
    HOST_METRICS_URL,
    INTERVAL
};