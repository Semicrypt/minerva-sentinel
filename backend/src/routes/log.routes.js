const express =
    require("express");

const auth =
    require("../middleware/auth.middleware");

const controller =
    require("../controllers/log.controller");

const router =
    express.Router();

/*
|--------------------------------------------------------------------------
| Log Routes
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    auth,
    controller.getLogs
);

router.get(
    "/stats",
    auth,
    controller.getStats
);

router.get(
    "/sources",
    auth,
    controller.getSources
);

module.exports =
    router;
