const ValidationError =
    require("../errors/ValidationError");

const repository =
    require(
        "../repositories/host-agent.repository"
    );

const {
    determineResourceStatus
} =
    require("./host-health.service");

/*
|--------------------------------------------------------------------------
| Text Validation
|--------------------------------------------------------------------------
*/

function normalizeText(
    value,
    fieldName,
    maxLength
) {
    if (
        typeof value !== "string" ||
        !value.trim()
    ) {
        throw new ValidationError(
            `${fieldName} is required.`
        );
    }

    const normalized =
        value.trim();

    if (
        normalized.length >
        maxLength
    ) {
        throw new ValidationError(
            `${fieldName} must not exceed ${maxLength} characters.`
        );
    }

    return normalized;
}

/*
|--------------------------------------------------------------------------
| Percentage Validation
|--------------------------------------------------------------------------
*/

function normalizePercentage(
    value,
    fieldName
) {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        throw new ValidationError(
            `${fieldName} is required.`
        );
    }

    const number =
        Number(value);

    if (
        !Number.isFinite(number) ||
        number < 0 ||
        number > 100
    ) {
        throw new ValidationError(
            `${fieldName} must be a number between 0 and 100.`
        );
    }

    return Number(
        number.toFixed(2)
    );
}

/*
|--------------------------------------------------------------------------
| Uptime Validation
|--------------------------------------------------------------------------
*/

function normalizeUptime(value) {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        throw new ValidationError(
            "Uptime is required."
        );
    }

    const uptime =
        Number(value);

    if (
        !Number.isFinite(uptime) ||
        uptime < 0 ||
        !Number.isSafeInteger(
            Math.floor(uptime)
        )
    ) {
        throw new ValidationError(
            "Uptime must be a valid non-negative number of seconds."
        );
    }

    return Math.floor(uptime);
}

/*
|--------------------------------------------------------------------------
| Normalize Host Metrics
|--------------------------------------------------------------------------
|
| Agent-supplied ownership, connection IDs and status values are ignored.
| Ownership comes only from the verified private agent key.
|--------------------------------------------------------------------------
*/

function normalizeHostMetrics(payload) {
    if (
        !payload ||
        typeof payload !== "object" ||
        Array.isArray(payload)
    ) {
        throw new ValidationError(
            "A valid host metric payload is required."
        );
    }

    return {
        hostname:
            normalizeText(
                payload.hostname,
                "Hostname",
                255
            ),

        platform:
            normalizeText(
                payload.platform,
                "Platform",
                50
            ),

        architecture:
            normalizeText(
                payload.architecture,
                "Architecture",
                50
            ),

        cpu:
            normalizePercentage(
                payload.cpu,
                "CPU usage"
            ),

        memory:
            normalizePercentage(
                payload.memory,
                "Memory usage"
            ),

        disk:
            normalizePercentage(
                payload.disk,
                "Disk usage"
            ),

        uptime:
            normalizeUptime(
                payload.uptime
            )
    };
}

/*
|--------------------------------------------------------------------------
| Save Authenticated Metrics
|--------------------------------------------------------------------------
*/

async function saveAuthenticatedMetrics(
    connection,
    payload
) {
    if (
        !connection?.id ||
        !connection?.userId
    ) {
        throw new Error(
            "A verified host connection is required."
        );
    }

    const metrics =
        normalizeHostMetrics(
            payload
        );

    const status =
        determineResourceStatus(
            metrics
        );

    return repository.saveHostMetrics({
        connectionId:
            connection.id,

        userId:
            connection.userId,

        metrics,

        status
    });
}

module.exports = {
    normalizeHostMetrics,
    saveAuthenticatedMetrics
};
