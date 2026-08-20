const express =
    require("express");

const auth =
    require(
        "../middleware/auth.middleware"
    );

const setupController =
    require(
        "../controllers/aws-setup.controller"
    );

const connectionController =
    require(
        "../controllers/aws-connection.controller"
    );

const resourceController =
    require(
        "../controllers/aws-resource.controller"
    );

const router =
    express.Router();

/*
|---------------------------------------------------------------------------
| Authenticated AWS Routes
|---------------------------------------------------------------------------
*/

router.use(auth);

/*
|---------------------------------------------------------------------------
| AWS Onboarding Configuration
|---------------------------------------------------------------------------
*/

router.get(
    "/setup",
    setupController.getSetup
);

/*
|---------------------------------------------------------------------------
| AWS Connections
|---------------------------------------------------------------------------
*/

router.get(
    "/connections",
    connectionController.getConnections
);

router.post(
    "/connections",
    connectionController.createConnection
);

router.post(
    "/connections/:id/verify",
    connectionController.verifyConnection
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
|---------------------------------------------------------------------------
| Account-Scoped AWS Resources
|---------------------------------------------------------------------------
*/

router.get(
    "/connections/:id/resources/ec2",
    resourceController.getEc2Inventory
);

module.exports =
    router;