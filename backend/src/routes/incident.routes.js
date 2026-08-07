const express = require("express");

const router = express.Router();

const auth =
require("../middleware/auth.middleware");

const controller =
require("../controllers/incident.controller");

router.get(

    "/",

    auth,

    controller.getAllIncidents

);

module.exports = router;