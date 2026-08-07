const express = require("express");

const controller =
require("../controllers/host.controller");

const router =
express.Router();

/*
|--------------------------------------------------------------------------
| Get All Hosts
|--------------------------------------------------------------------------
*/

router.get(

    "/",

    controller.getAll

);

/*
|--------------------------------------------------------------------------
| Get One Host
|--------------------------------------------------------------------------
*/

router.get(

    "/:hostname",

    controller.getOne

);

module.exports = router;