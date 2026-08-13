const express =
    require("express");

const auth =
    require(
        "../middleware/auth.middleware"
    );

const hostAgentAuth =
    require(
        "../middleware/host-agent-auth.middleware"
    );

const hostController =
    require(
        "../controllers/host.controller"
    );

const connectionController =
    require(
        "../controllers/host-connection.controller"
    );

const agentController =
    require(
        "../controllers/host-agent.controller"
    );

const router =
    express.Router();

/*
|--------------------------------------------------------------------------
| Host Agent Upload
|--------------------------------------------------------------------------
|
| Agents authenticate using their private host key, not a browser JWT.
|--------------------------------------------------------------------------
*/

router.post(
    "/agent/metrics",
    hostAgentAuth,
    agentController.receiveMetrics
);

/*
|--------------------------------------------------------------------------
| Authenticated Browser Routes
|--------------------------------------------------------------------------
*/

router.use(auth);

/*
|--------------------------------------------------------------------------
| Host Connections
|--------------------------------------------------------------------------
*/

router.get(
    "/connections",
    connectionController.getConnections
);

router.post(
    "/connections",
    connectionController.createConnection
);

router.patch(
    "/connections/:id/disconnect",
    connectionController.disconnectConnection
);

router.delete(
    "/connections/:id",
    connectionController.deleteConnection
);

/*
|--------------------------------------------------------------------------
| Host Inventory
|--------------------------------------------------------------------------
|
| Keep the dynamic hostname route last so words such as "connections"
| are never interpreted as hostnames.
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    hostController.getAll
);

router.get(
    "/:hostname",
    hostController.getOne
);

module.exports =
    router;