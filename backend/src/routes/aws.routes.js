const express =
    require("express");

const auth =
    require(
        "../middleware/auth.middleware"
    );

const connectionController =
    require(
        "../controllers/aws-connection.controller"
    );

const router =
    express.Router();

/*
|---------------------------------------------------------------------------
| Authenticated AWS Connection Routes
|---------------------------------------------------------------------------
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

module.exports =
    router;
