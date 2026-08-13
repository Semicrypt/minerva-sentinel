const os = require("os");
const si = require("systeminformation");

const metricsService =
    require("./metrics.service");

/*
|--------------------------------------------------------------------------
| Monitoring Configuration
|--------------------------------------------------------------------------
*/

const COLLECTION_INTERVAL_MS = 5000;

/*
|--------------------------------------------------------------------------
| In-Memory State
|--------------------------------------------------------------------------
*/

let latestMetrics = null;
let monitoringInterval = null;
let monitoringStarted = false;
let io = null;

/*
|--------------------------------------------------------------------------
| Socket.IO
|--------------------------------------------------------------------------
*/

function setSystemMetricsSocketIO(
    socketServer
) {
    io = socketServer;
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function round(value, decimals = 2) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Number(
        number.toFixed(decimals)
    );
}

function bytesToGB(bytes) {
    return round(
        Number(bytes || 0) /
        1024 /
        1024 /
        1024
    );
}

function formatUptime(seconds) {
    const totalSeconds =
        Math.floor(
            Number(seconds) || 0
        );

    const days =
        Math.floor(
            totalSeconds / 86400
        );

    const hours =
        Math.floor(
            (totalSeconds % 86400) /
            3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) /
            60
        );

    const remainingSeconds =
        totalSeconds % 60;

    return {
        seconds: totalSeconds,
        formatted:
            `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`
    };
}

function getMainDisk(filesystems) {
    if (
        !Array.isArray(filesystems) ||
        filesystems.length === 0
    ) {
        return null;
    }

    return (
        filesystems.find(
            disk => disk.mount === "/"
        ) ||
        filesystems[0]
    );
}

function combineNetworkStats(
    networkStats
) {
    if (!Array.isArray(networkStats)) {
        return {
            interfaces: [],
            rxBytes: 0,
            txBytes: 0,
            rxPerSecond: 0,
            txPerSecond: 0
        };
    }

    const usableInterfaces =
        networkStats.filter(
            network => {
                const iface =
                    String(
                        network.iface || ""
                    ).toLowerCase();

                return (
                    iface !== "lo" &&
                    iface !== "loopback"
                );
            }
        );

    const interfaces =
        usableInterfaces.length > 0
            ? usableInterfaces
            : networkStats;

    const totals =
        interfaces.reduce(
            (result, network) => {
                result.rxBytes +=
                    Number(
                        network.rx_bytes
                    ) || 0;

                result.txBytes +=
                    Number(
                        network.tx_bytes
                    ) || 0;

                result.rxPerSecond +=
                    Number(
                        network.rx_sec
                    ) || 0;

                result.txPerSecond +=
                    Number(
                        network.tx_sec
                    ) || 0;

                return result;
            },
            {
                rxBytes: 0,
                txBytes: 0,
                rxPerSecond: 0,
                txPerSecond: 0
            }
        );

    return {
        interfaces:
            interfaces.map(
                network =>
                    network.iface
            ),

        rxBytes:
            Math.round(
                totals.rxBytes
            ),

        txBytes:
            Math.round(
                totals.txBytes
            ),

        rxPerSecond:
            Math.round(
                totals.rxPerSecond
            ),

        txPerSecond:
            Math.round(
                totals.txPerSecond
            )
    };
}

/*
|--------------------------------------------------------------------------
| Collect System Metrics
|--------------------------------------------------------------------------
*/

async function collectSystemMetrics() {
    const [
        cpuInfo,
        cpuLoad,
        memory,
        filesystems,
        networkStats,
        osInfo
    ] = await Promise.all([
        si.cpu(),
        si.currentLoad(),
        si.mem(),
        si.fsSize(),
        si.networkStats(),
        si.osInfo()
    ]);

    const cpuUsage =
        round(
            cpuLoad.currentLoad
        );

    const memoryUsage =
        memory.total > 0
            ? round(
                (
                    memory.used /
                    memory.total
                ) * 100
            )
            : 0;

    const mainDisk =
        getMainDisk(
            filesystems
        );

    const disk =
        mainDisk
            ? {
                filesystem:
                    mainDisk.fs || null,

                mount:
                    mainDisk.mount || null,

                totalBytes:
                    Number(
                        mainDisk.size
                    ) || 0,

                usedBytes:
                    Number(
                        mainDisk.used
                    ) || 0,

                availableBytes:
                    Number(
                        mainDisk.available
                    ) || 0,

                totalGB:
                    bytesToGB(
                        mainDisk.size
                    ),

                usedGB:
                    bytesToGB(
                        mainDisk.used
                    ),

                availableGB:
                    bytesToGB(
                        mainDisk.available
                    ),

                usage:
                    round(
                        mainDisk.use
                    )
            }
            : {
                filesystem: null,
                mount: null,
                totalBytes: 0,
                usedBytes: 0,
                availableBytes: 0,
                totalGB: 0,
                usedGB: 0,
                availableGB: 0,
                usage: 0
            };

    const network =
        combineNetworkStats(
            networkStats
        );

    return {
        hostname:
            os.hostname(),

        platform:
            osInfo.platform ||
            os.platform(),

        distro:
            osInfo.distro ||
            null,

        release:
            osInfo.release ||
            os.release(),

        architecture:
            osInfo.arch ||
            os.arch(),

        cpu: {
            manufacturer:
                cpuInfo.manufacturer ||
                null,

            brand:
                cpuInfo.brand ||
                null,

            cores:
                Number(
                    cpuInfo.cores
                ) || 0,

            physicalCores:
                Number(
                    cpuInfo.physicalCores
                ) || 0,

            processors:
                Number(
                    cpuInfo.processors
                ) || 0,

            speedGHz:
                round(
                    cpuInfo.speed
                ),

            usage:
                cpuUsage
        },

        memory: {
            totalBytes:
                Number(
                    memory.total
                ) || 0,

            usedBytes:
                Number(
                    memory.used
                ) || 0,

            freeBytes:
                Number(
                    memory.free
                ) || 0,

            availableBytes:
                Number(
                    memory.available
                ) || 0,

            totalGB:
                bytesToGB(
                    memory.total
                ),

            usedGB:
                bytesToGB(
                    memory.used
                ),

            freeGB:
                bytesToGB(
                    memory.free
                ),

            availableGB:
                bytesToGB(
                    memory.available
                ),

            usage:
                memoryUsage
        },

        disk,

        network,

        uptime:
            formatUptime(
                os.uptime()
            ),

        collectedAt:
            new Date().toISOString()
    };
}

/*
|--------------------------------------------------------------------------
| Broadcast Metrics
|--------------------------------------------------------------------------
*/

function broadcastSystemMetrics(metrics) {
    if (!io || !metrics) {
        return;
    }

    io.emit(
        "system:metrics",
        metrics
    );
}

/*
|--------------------------------------------------------------------------
| Persist Internal Metrics
|--------------------------------------------------------------------------
|
| Internal backend metrics are stored only as metric history. They must not
| create Infrastructure hosts because the backend runs inside Docker and its
| hostname changes every time the container is rebuilt.
|--------------------------------------------------------------------------
*/

async function persistSystemMetrics(metrics) {
    if (!metrics) {
        return null;
    }

    const databaseMetrics = {
        hostname:
            metrics.hostname,

        cpu:
            metrics.cpu.usage,

        memory:
            metrics.memory.usage,

        disk:
            metrics.disk.usage,

        uptime:
            metrics.uptime.seconds,

        platform:
            metrics.platform,

        architecture:
            metrics.architecture
    };

    try {
        return await metricsService
            .saveMetricsHistory(
                databaseMetrics
            );
    } catch (error) {
        /*
         * Database failure must not stop live monitoring.
         */
        console.error(
            "❌ System metrics persistence failed:",
            error.message
        );

        return null;
    }
}

/*
|--------------------------------------------------------------------------
| Run Monitoring Cycle
|--------------------------------------------------------------------------
*/

async function runMonitoringCycle() {
    try {
        const metrics =
            await collectSystemMetrics();

        latestMetrics = metrics;

        broadcastSystemMetrics(
            metrics
        );

        /*
         * Save history without adding the backend container
         * to the Infrastructure host inventory.
         */
        await persistSystemMetrics(
            metrics
        );

        console.log(
            `📊 System Metrics | CPU ${metrics.cpu.usage}% | RAM ${metrics.memory.usage}% | Disk ${metrics.disk.usage}%`
        );

        return metrics;
    } catch (error) {
        console.error(
            "❌ System metrics collection failed:",
            error.message
        );

        return null;
    }
}

/*
|--------------------------------------------------------------------------
| Start Monitoring
|--------------------------------------------------------------------------
*/

async function startSystemMonitoring() {
    if (monitoringStarted) {
        return;
    }

    monitoringStarted = true;

    console.log(
        "📡 System monitoring started"
    );

    console.log(
        `⏱️ Collection interval: ${COLLECTION_INTERVAL_MS / 1000} seconds`
    );

    await runMonitoringCycle();

    monitoringInterval =
        setInterval(
            runMonitoringCycle,
            COLLECTION_INTERVAL_MS
        );
}

/*
|--------------------------------------------------------------------------
| Stop Monitoring
|--------------------------------------------------------------------------
*/

function stopSystemMonitoring() {
    if (monitoringInterval) {
        clearInterval(
            monitoringInterval
        );

        monitoringInterval = null;
    }

    monitoringStarted = false;
}

/*
|--------------------------------------------------------------------------
| Get Latest Metrics
|--------------------------------------------------------------------------
*/

async function getSystemMetrics() {
    if (latestMetrics) {
        return latestMetrics;
    }

    return runMonitoringCycle();
}

/*
|--------------------------------------------------------------------------
| Monitoring Status
|--------------------------------------------------------------------------
*/

function getMonitoringStatus() {
    return {
        running:
            monitoringStarted,

        intervalMs:
            COLLECTION_INTERVAL_MS,

        hasData:
            latestMetrics !== null,

        socketEnabled:
            io !== null,

        lastCollectedAt:
            latestMetrics
                ? latestMetrics.collectedAt
                : null
    };
}

module.exports = {
    collectSystemMetrics,
    runMonitoringCycle,
    startSystemMonitoring,
    stopSystemMonitoring,
    getSystemMetrics,
    getMonitoringStatus,
    setSystemMetricsSocketIO,
    persistSystemMetrics
};