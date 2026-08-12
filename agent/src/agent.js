const {
    collectDockerSnapshot
} =
    require("./docker-snapshot");

const {
    sendDockerSnapshot
} =
    require("./sender");

const {
    DOCKER_SNAPSHOT_URL,
    MINERVA_AGENT_KEY,
    INTERVAL
} =
    require("./config");

let stopping = false;
let nextCycleTimer = null;

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

async function runAgentCycle() {
    const startedAt = Date.now();

    try {
        console.log();
        console.log(
            "Collecting Docker snapshot..."
        );

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
                response.success === true,

            elapsed:
                `${elapsedSeconds}s`
        });
    } catch (error) {
        console.error(
            "❌ Minerva Docker Agent:",
            error.message
        );
    } finally {
        scheduleNextCycle();
    }
}

function stopAgent(signal) {
    stopping = true;

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

if (!MINERVA_AGENT_KEY) {
    console.error(
        "❌ MINERVA_AGENT_KEY is missing from agent/.env"
    );

    process.exit(1);
}

console.log(
    "🚀 Minerva Sentinel Docker Agent"
);

console.log(
    `Backend: ${DOCKER_SNAPSHOT_URL}`
);

console.log(
    `Interval: ${INTERVAL / 1000} seconds`
);

process.on(
    "SIGINT",
    () => stopAgent("SIGINT")
);

process.on(
    "SIGTERM",
    () => stopAgent("SIGTERM")
);

runAgentCycle();