const express =
    require("express");

const auth =
    require(
        "../middleware/auth.middleware"
    );

const dockerAgentAuth =
    require(
        "../middleware/docker-agent-auth.middleware"
    );

const connectionController =
    require(
        "../controllers/docker-connection.controller"
    );

const agentController =
    require(
        "../controllers/docker-agent.controller"
    );

const snapshotController =
    require(
        "../controllers/docker-snapshot.controller"
    );

const router =
    express.Router();

/*
|--------------------------------------------------------------------------
| Docker Agent Upload
|--------------------------------------------------------------------------
*/

router.post(
    "/agent/snapshot",
    dockerAgentAuth,
    agentController.receiveSnapshot
);

/*
|--------------------------------------------------------------------------
| Authenticated Browser Endpoints
|--------------------------------------------------------------------------
*/

router.use(auth);

router.get(
    "/connections",
    connectionController.getConnections
);

router.post(
    "/connections",
    connectionController.createConnection
);

router.delete(
    "/connections/:id",
    connectionController.disconnectConnection
);

router.get(
    "/info",
    snapshotController.info
);

router.get(
    "/images",
    snapshotController.images
);

router.get(
    "/networks",
    snapshotController.networks
);

router.get(
    "/volumes",
    snapshotController.volumes
);

router.get(
    "/containers",
    snapshotController.containers
);

router.get(
    "/containers/:id",
    snapshotController.container
);

module.exports = router;