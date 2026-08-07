const si = require("systeminformation");
const os = require("os");

/*
|--------------------------------------------------------------------------
| Find Main Disk
|--------------------------------------------------------------------------
*/

function getMainDisk(disks) {

    if (
        !Array.isArray(disks) ||
        disks.length === 0
    ) {

        return null;

    }

    return (
        disks.find(
            disk =>
                disk.mount === "/"
        ) ||
        disks[0]
    );

}

/*
|--------------------------------------------------------------------------
| Collect System Metrics
|--------------------------------------------------------------------------
*/

async function getSystemMetrics() {

    const [
        load,
        memory,
        disks
    ] =
        await Promise.all([

            si.currentLoad(),

            si.mem(),

            si.fsSize()

        ]);

    const mainDisk =
        getMainDisk(
            disks
        );

    return {

        hostname:
            os.hostname(),

        platform:
            os.platform(),

        architecture:
            os.arch(),

        uptime:
            Math.floor(
                os.uptime()
            ),

        cpu:
            Number(
                load.currentLoad
                    .toFixed(2)
            ),

        memory:
            Number(
                (
                    (
                        memory.used /
                        memory.total
                    ) * 100
                ).toFixed(2)
            ),

        disk:
            mainDisk
                ? Number(
                    Number(
                        mainDisk.use || 0
                    ).toFixed(2)
                )
                : 0,

        timestamp:
            new Date()
                .toISOString()

    };

}

module.exports = {

    getSystemMetrics

};