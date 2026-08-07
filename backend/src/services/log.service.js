const logRepository =
    require("../repositories/log.repository");

let ioInstance = null;

/*
|--------------------------------------------------------------------------
| Socket.IO Connection
|--------------------------------------------------------------------------
*/

function setSocketIO(io) {

    ioInstance =
        io;

}

/*
|--------------------------------------------------------------------------
| Normalize Log Level
|--------------------------------------------------------------------------
*/

function normalizeLevel(level) {

    const allowedLevels =
        [
            "INFO",
            "WARNING",
            "ERROR",
            "CRITICAL"
        ];

    const normalized =
        String(
            level || "INFO"
        ).toUpperCase();

    if (
        allowedLevels.includes(
            normalized
        )
    ) {

        return normalized;

    }

    return "INFO";

}

/*
|--------------------------------------------------------------------------
| Create Log
|--------------------------------------------------------------------------
*/

async function createLog(data) {

    if (
        !data.source
    ) {

        throw new Error(
            "Log source is required."
        );

    }

    if (
        !data.message
    ) {

        throw new Error(
            "Log message is required."
        );

    }

    const log =
        await logRepository.createLog(
            {

                level:
                    normalizeLevel(
                        data.level
                    ),

                source:
                    String(
                        data.source
                    ),

                message:
                    String(
                        data.message
                    ),

                userId:
                    data.userId ||
                    null,

                serviceId:
                    data.serviceId ||
                    null,

                metadata:
                    data.metadata ||
                    {}

            }
        );

    /*
    |--------------------------------------------------------------------------
    | Live Log Broadcast
    |--------------------------------------------------------------------------
    */

    if (
        ioInstance
    ) {

        ioInstance.emit(
            "log:event",
            log
        );

    }

    return log;

}

/*
|--------------------------------------------------------------------------
| Get Logs
|--------------------------------------------------------------------------
*/

async function getLogs(options = {}) {

    return logRepository.getLogs(
        options
    );

}

/*
|--------------------------------------------------------------------------
| Get Log Statistics
|--------------------------------------------------------------------------
*/

async function getLogStats() {

    return logRepository.getLogStats();

}

/*
|--------------------------------------------------------------------------
| Get Log Sources
|--------------------------------------------------------------------------
*/

async function getLogSources() {

    return logRepository.getLogSources();

}

module.exports = {

    setSocketIO,

    createLog,

    getLogs,

    getLogStats,

    getLogSources

};