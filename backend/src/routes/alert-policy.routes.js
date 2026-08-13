const express = require("express");

const auth = require(
    "../middleware/auth.middleware"
);

const controller = require(
    "../controllers/alert-policy.controller"
);

const router = express.Router();

router.get(
    "/",
    auth,
    controller.getPolicies
);

module.exports = router;
