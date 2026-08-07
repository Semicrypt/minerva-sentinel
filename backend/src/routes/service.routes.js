const express = require("express");

const controller =
require("../controllers/service.controller");

const auth =
require("../middleware/auth.middleware");

const router =
express.Router();

/*
|--------------------------------------------------------------------------
| Create Service
|--------------------------------------------------------------------------
*/

router.post(

    "/",

    auth,

    controller.create

);

/*
|--------------------------------------------------------------------------
| Get All Services
|--------------------------------------------------------------------------
*/

router.get(

    "/",

    auth,

    controller.getAll

);

/*
|--------------------------------------------------------------------------
| Get Single Service
|--------------------------------------------------------------------------
*/

router.get(

    "/:id",

    auth,

    controller.getById

);

/*
|--------------------------------------------------------------------------
| Delete Service
|--------------------------------------------------------------------------
*/

router.delete(

    "/:id",

    auth,

    controller.remove

);

module.exports = router;