require("dotenv").config();

function removeTrailingSlash(value) {
    return String(value || "")
        .trim()
        .replace(/\/+$/, "");
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

module.exports = {
    MINERVA_API_URL,
    MINERVA_AGENT_KEY,
    DOCKER_SNAPSHOT_URL,
    INTERVAL
};