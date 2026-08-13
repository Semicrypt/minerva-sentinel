const express =
    require("express");

const cors =
    require("cors");

const authRoutes =
    require("./routes/auth.routes");

const serviceRoutes =
    require("./routes/service.routes");

const dashboardRoutes =
    require("./routes/dashboard.routes");

const checkRoutes =
    require("./routes/check.routes");

const incidentRoutes =
    require("./routes/incident.routes");

const alertPolicyRoutes =
    require("./routes/alert-policy.routes");

const metricsRoutes =
    require("./routes/metrics.routes");

const hostRoutes =
    require("./routes/host.routes");

const dockerRoutes =
    require("./routes/docker.routes");

const logRoutes =
    require("./routes/log.routes");

const requestLogger =
    require("./middleware/request-logger.middleware");

const errorMiddleware =
    require("./middleware/error.middleware");

const app =
    express();

/*
|--------------------------------------------------------------------------
| Core Middleware
|--------------------------------------------------------------------------
*/

app.use(
    cors()
);

app.use(
    express.json()
);

/*
|--------------------------------------------------------------------------
| Request Logging
|--------------------------------------------------------------------------
*/

app.use(
    requestLogger
);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get(
    "/api/health",

    (req, res) => {
        res.json({
            success: true,
            message:
                "Minerva Sentinel API",
            timestamp:
                new Date().toISOString()
        });
    }
);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/services",
    serviceRoutes
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use(
    "/api/checks",
    checkRoutes
);

app.use(
    "/api/incidents",
    incidentRoutes
);

app.use(
    "/api/alert-policies",
    alertPolicyRoutes
);

app.use(
    "/api/metrics",
    metricsRoutes
);

app.use(
    "/api/hosts",
    hostRoutes
);

app.use(
    "/api/docker",
    dockerRoutes
);

app.use(
    "/api/logs",
    logRoutes
);

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use(
    errorMiddleware
);

module.exports =
    app;