const si =
    require("systeminformation");

const os =
    require("os");

const fs =
    require("fs/promises");

const {
    MINERVA_HOSTNAME,
    MINERVA_HOST_ROOT
} =
    require("./config");

/*
|--------------------------------------------------------------------------
| Percentage Helpers
|--------------------------------------------------------------------------
*/

function roundPercentage(value) {
    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Number(
        Math.min(
            100,
            Math.max(0, number)
        ).toFixed(2)
    );
}

/*
|--------------------------------------------------------------------------
| Host Disk Usage
|--------------------------------------------------------------------------
|
| The public Docker command mounts the monitored Linux host's root
| filesystem at /hostfs with read-only access.
|--------------------------------------------------------------------------
*/

async function getHostDiskUsage() {
    try {
        const filesystem =
            await fs.statfs(
                MINERVA_HOST_ROOT,
                {
                    bigint: true
                }
            );

        const totalBytes =
            filesystem.blocks *
            filesystem.bsize;

        const freeBytes =
            filesystem.bfree *
            filesystem.bsize;

        if (totalBytes <= 0n) {
            return 0;
        }

        const usedBytes =
            totalBytes -
            freeBytes;

        const hundredths =
            (
                usedBytes *
                10000n
            ) /
            totalBytes;

        return roundPercentage(
            Number(hundredths) /
            100
        );
    } catch (error) {
        throw new Error(
            `Unable to read the monitored host filesystem at ${MINERVA_HOST_ROOT}. ` +
            "Start the Host Agent with the required read-only host mount."
        );
    }
}

/*
|--------------------------------------------------------------------------
| Memory Usage
|--------------------------------------------------------------------------
|
| Available memory is subtracted from total memory so filesystem cache is
| not incorrectly displayed as unavailable RAM.
|--------------------------------------------------------------------------
*/

function getMemoryUsage(memory) {
    const total =
        Number(memory.total || 0);

    const available =
        Number(memory.available || 0);

    if (total <= 0) {
        return 0;
    }

    const used =
        available >= 0 &&
        available <= total
            ? total - available
            : Number(
                memory.active ||
                memory.used ||
                0
            );

    return roundPercentage(
        (used / total) * 100
    );
}

/*
|--------------------------------------------------------------------------
| Collect Host Metrics
|--------------------------------------------------------------------------
*/

async function getSystemMetrics() {
    if (!MINERVA_HOSTNAME) {
        throw new Error(
            "MINERVA_HOSTNAME is required in Host Agent mode."
        );
    }

    const [
        load,
        memory,
        disk
    ] =
        await Promise.all([
            si.currentLoad(),
            si.mem(),
            getHostDiskUsage()
        ]);

    return {
        hostname:
            MINERVA_HOSTNAME,

        platform:
            os.platform(),

        architecture:
            os.arch(),

        uptime:
            Math.floor(
                os.uptime()
            ),

        cpu:
            roundPercentage(
                load.currentLoad
            ),

        memory:
            getMemoryUsage(
                memory
            ),

        disk,

        timestamp:
            new Date()
                .toISOString()
    };
}

module.exports = {
    getSystemMetrics
};