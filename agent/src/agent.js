const {
    collectDockerSnapshot
} =
    require("./docker-snapshot");

const {
    getSystemMetrics
} =
    require("./system");

const {
    sendDockerSnapshot,
    sendHostMetrics
} =
    require("./sender");

const {
    MINERVA_AGENT_KEY,
    MINERVA_AGENT_MODE,
    DOCKER_SNAPSHOT_URL,
    HOST_METRICS_URL,
    INTERVAL
} =
    require("./config");

let stopping =
    false;

let nextCycleTimer =
    null;

/*
|--------------------------------------------------------------------------
| Schedule Next Cycle
|--------------------------------------------------------------------------
|
| setTimeout is used after each completed cycle. This prevents overlapping
| uploads when one collection takes longer than the configured interval.
|--------------------------------------------------------------------------
*/

function scheduleNextCycle() {
    if (stopping) {
        return;
    }

    nextCycleTimer =
        setTimeout(
            runAgentCycle,
            INTERVAL
        );
}

/*
|--------------------------------------------------------------------------
| Docker Monitoring
|--------------------------------------------------------------------------
*/

async function runDockerCycle() {
    console.log();
    console.log(
        "Collecting Docker snapshot..."
    );

    const startedAt =
        Date.now();

    const snapshot =
        await collectDockerSnapshot();

    const response =
        await sendDockerSnapshot(
            snapshot
        );

    const elapsedSeconds =
        (
            (Date.now() - startedAt) /
            1000
        ).toFixed(1);

    console.log(
        "✅ Docker snapshot uploaded"
    );

    console.log({
        engine:
            snapshot.engineInfo.name,

        version:
            snapshot.engineInfo
                .serverVersion,

        containers:
            snapshot.containers.length,

        images:
            snapshot.images.length,

        networks:
            snapshot.networks.length,

        volumes:
            snapshot.volumes.length,

        accepted:
            response?.accepted === true ||
            response?.success === true,

        elapsed:
            `${elapsedSeconds}s`
    });
}

/*
|--------------------------------------------------------------------------
| Host Monitoring
|--------------------------------------------------------------------------
*/

async function runHostCycle() {
    console.log();
    console.log(
        "Collecting host metrics..."
    );

    const startedAt =
        Date.now();

    const metrics =
        await getSystemMetrics();

    const response =
        await sendHostMetrics(
            metrics
        );

    const elapsedSeconds =
        (
            (Date.now() - startedAt) /
            1000
        ).toFixed(1);

    console.log(
        "✅ Host metrics uploaded"
    );

    console.log({
        hostname:
            metrics.hostname,

        platform:
            metrics.platform,

        architecture:
            metrics.architecture,

        cpu:
            `${metrics.cpu}%`,

        memory:
            `${metrics.memory}%`,

        disk:
            `${metrics.disk}%`,

        uptime:
            `${metrics.uptime}s`,

        accepted:
            response?.accepted === true ||
            response?.success === true,

        elapsed:
            `${elapsedSeconds}s`
    });
}

/*
|--------------------------------------------------------------------------
| Run Selected Mode
|--------------------------------------------------------------------------
*/

async function runAgentCycle() {
    try {
        if (
            MINERVA_AGENT_MODE ===
            "host"
        ) {
            await runHostCycle();
        } else {
            await runDockerCycle();
        }
    } catch (error) {
        const modeName =
            MINERVA_AGENT_MODE === "host"
                ? "Host"
                : "Docker";

        console.error(
            `❌ Minerva ${modeName} Agent:`,
            error.message
        );
    } finally {
        scheduleNextCycle();
    }
}

/*
|--------------------------------------------------------------------------
| Graceful Shutdown
|--------------------------------------------------------------------------
*/

function stopAgent(signal) {
    stopping =
        true;

    if (nextCycleTimer) {
        clearTimeout(
            nextCycleTimer
        );
    }

    console.log(
        `\n${signal} received. Agent stopped.`
    );

    process.exit(0);
}

/*
|--------------------------------------------------------------------------
| Startup Validation
|--------------------------------------------------------------------------
*/

if (!MINERVA_AGENT_KEY) {
    console.error(
        "❌ MINERVA_AGENT_KEY is required."
    );

    process.exit(1);
}

const agentName =
    MINERVA_AGENT_MODE === "host"
        ? "Host Agent"
        : "Docker Agent";

const uploadUrl =
    MINERVA_AGENT_MODE === "host"
        ? HOST_METRICS_URL
        : DOCKER_SNAPSHOT_URL;

console.log(
    `🚀 Minerva Sentinel ${agentName}`
);

console.log(
    `Mode: ${MINERVA_AGENT_MODE}`
);

console.log(
    `Backend: ${uploadUrl}`
);

console.log(
    `Interval: ${INTERVAL / 1000} seconds`
);

process.on(
    "SIGINT",
    () =>
        stopAgent("SIGINT")
);

process.on(
    "SIGTERM",
    () =>
        stopAgent("SIGTERM")
);

runAgentCycle();