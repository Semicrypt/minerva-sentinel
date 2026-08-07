require("dotenv").config();

const http =
    require("http");

const {
    Server
} =
    require("socket.io");

const app =
    require("./app");

const pool =
    require("./config/database");

/*
|--------------------------------------------------------------------------
| Service Monitoring
|--------------------------------------------------------------------------
*/

const {

    monitorServices,

    setSocketIO:
        setMonitorSocketIO

} =
require(
    "./services/monitor.service"
);

/*
|--------------------------------------------------------------------------
| System Metrics Monitoring
|--------------------------------------------------------------------------
*/

const {

    startSystemMonitoring,

    stopSystemMonitoring,

    setSystemMetricsSocketIO

} =
require(
    "./services/system-metrics.service"
);

/*
|--------------------------------------------------------------------------
| Host Health Monitoring
|--------------------------------------------------------------------------
*/

const {

    refreshHostStatuses,

    getHostHealthConfig

} =
require(
    "./services/host-health.service"
);

/*
|--------------------------------------------------------------------------
| Logging
|--------------------------------------------------------------------------
*/

const {

    setSocketIO:
        setLogSocketIO,

    createLog

} =
require(
    "./services/log.service"
);

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

const PORT =
    process.env.PORT || 5000;

const HOST_HEALTH_CHECK_INTERVAL_MS =
    10000;

/*
|--------------------------------------------------------------------------
| Interval References
|--------------------------------------------------------------------------
*/

let serviceMonitoringInterval =
    null;

let hostHealthInterval =
    null;

/*
|--------------------------------------------------------------------------
| HTTP Server
|--------------------------------------------------------------------------
*/

const server =
    http.createServer(
        app
    );

/*
|--------------------------------------------------------------------------
| Socket.IO Server
|--------------------------------------------------------------------------
*/

const io =
    new Server(
        server,
        {

            cors: {

                origin:
                    "*"

            }

        }
    );

/*
|--------------------------------------------------------------------------
| Share Socket.IO
|--------------------------------------------------------------------------
|
| All real-time backend systems use the same Socket.IO server.
|--------------------------------------------------------------------------
*/

setMonitorSocketIO(
    io
);

setSystemMetricsSocketIO(
    io
);

setLogSocketIO(
    io
);

/*
|--------------------------------------------------------------------------
| Socket.IO Connections
|--------------------------------------------------------------------------
*/

io.on(
    "connection",
    socket => {

        console.log(
            `🟢 Client Connected | ${socket.id}`
        );

        socket.on(
            "disconnect",
            () => {

                console.log(
                    `🔴 Client Disconnected | ${socket.id}`
                );

            }
        );

    }
);

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

async function startServer() {

    try {

        /*
        |--------------------------------------------------------------------------
        | Verify PostgreSQL
        |--------------------------------------------------------------------------
        */

        await pool.query(
            "SELECT NOW()"
        );

        /*
        |--------------------------------------------------------------------------
        | Start HTTP Server
        |--------------------------------------------------------------------------
        */

        server.listen(
            PORT,
            async () => {

                console.log(
                    "======================================="
                );

                console.log(
                    "🚀 Minerva Sentinel API"
                );

                console.log(
                    "✅ PostgreSQL Connected"
                );

                console.log(
                    `🌐 Running on http://localhost:${PORT}`
                );

                console.log(
                    "🔌 Socket.IO Ready"
                );

                console.log(
                    "📝 Central logging enabled"
                );

                console.log(
                    "======================================="
                );

                /*
                |--------------------------------------------------------------------------
                | Record Server Startup
                |--------------------------------------------------------------------------
                */

                try {

                    await createLog(
                        {

                            level:
                                "INFO",

                            source:
                                "Minerva Server",

                            message:
                                `Minerva Sentinel API started on port ${PORT}`,

                            metadata:
                                {

                                    port:
                                        Number(
                                            PORT
                                        ),

                                    environment:
                                        process.env.NODE_ENV ||
                                        "development"

                                }

                        }
                    );

                }

                catch (error) {

                    console.error(
                        "❌ Unable to record startup log:",
                        error.message
                    );

                }

            }
        );

        /*
        |--------------------------------------------------------------------------
        | Start System Monitoring
        |--------------------------------------------------------------------------
        */

        await startSystemMonitoring();

        /*
        |--------------------------------------------------------------------------
        | Start Host Health Monitoring
        |--------------------------------------------------------------------------
        */

        const healthConfig =
            getHostHealthConfig();

        console.log(
            "🩺 Host health monitoring started"
        );

        console.log(
            `⏱️ Offline threshold: ${healthConfig.offlineThresholdSeconds} seconds`
        );

        console.log(
            `⚠️ Warning threshold: ${healthConfig.warningThreshold}%`
        );

        await refreshHostStatuses();

        hostHealthInterval =
            setInterval(

                refreshHostStatuses,

                HOST_HEALTH_CHECK_INTERVAL_MS

            );

        /*
        |--------------------------------------------------------------------------
        | Start Service Availability Monitoring
        |--------------------------------------------------------------------------
        */

        await monitorServices();

        serviceMonitoringInterval =
            setInterval(

                monitorServices,

                60000

            );

    }

    catch (error) {

        console.error(
            "❌ Server startup failed:"
        );

        console.error(
            error
        );

        process.exit(
            1
        );

    }

}

/*
|--------------------------------------------------------------------------
| Graceful Shutdown
|--------------------------------------------------------------------------
*/

async function shutdown(
    signal
) {

    console.log(
        `\n🛑 ${signal} received`
    );

    console.log(
        "Stopping Minerva Sentinel..."
    );

    /*
    |--------------------------------------------------------------------------
    | Record Shutdown
    |--------------------------------------------------------------------------
    */

    try {

        await createLog(
            {

                level:
                    "INFO",

                source:
                    "Minerva Server",

                message:
                    `Minerva Sentinel shutdown initiated by ${signal}`,

                metadata:
                    {

                        signal

                    }

            }
        );

    }

    catch (error) {

        console.error(
            "❌ Unable to record shutdown log:",
            error.message
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Stop System Monitoring
    |--------------------------------------------------------------------------
    */

    stopSystemMonitoring();

    /*
    |--------------------------------------------------------------------------
    | Stop Host Health Monitoring
    |--------------------------------------------------------------------------
    */

    if (
        hostHealthInterval
    ) {

        clearInterval(
            hostHealthInterval
        );

        hostHealthInterval =
            null;

    }

    /*
    |--------------------------------------------------------------------------
    | Stop Service Monitoring
    |--------------------------------------------------------------------------
    */

    if (
        serviceMonitoringInterval
    ) {

        clearInterval(
            serviceMonitoringInterval
        );

        serviceMonitoringInterval =
            null;

    }

    /*
    |--------------------------------------------------------------------------
    | Close HTTP Server
    |--------------------------------------------------------------------------
    */

    server.close(
        async () => {

            try {

                await pool.end();

                console.log(
                    "✅ PostgreSQL connection closed"
                );

            }

            catch (error) {

                console.error(
                    "❌ Error closing PostgreSQL:",
                    error.message
                );

            }

            console.log(
                "✅ Minerva Sentinel stopped"
            );

            process.exit(
                0
            );

        }
    );

}

/*
|--------------------------------------------------------------------------
| Shutdown Signals
|--------------------------------------------------------------------------
*/

process.on(
    "SIGINT",
    () =>
        shutdown(
            "SIGINT"
        )
);

process.on(
    "SIGTERM",
    () =>
        shutdown(
            "SIGTERM"
        )
);

/*
|--------------------------------------------------------------------------
| Boot
|--------------------------------------------------------------------------
*/

startServer();