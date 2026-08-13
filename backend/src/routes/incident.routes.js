const express = require("express");

const router = express.Router();

const auth = require(
    "../middleware/auth.middleware"
);

const controller = require(
    "../controllers/incident.controller"
);

const activityController = require(
    "../controllers/incident-activity.controller"
);

router.patch(
    "/acknowledge-all",
    auth,
    controller.acknowledgeAllIncidents
);

router.get(
    "/timeline",
    auth,
    controller.getIncidentTimeline
);

router.post(
    "/:id/root-cause",
    auth,
    activityController.recordRootCause
);

router.post(
    "/:id/remediation",
    auth,
    activityController.recordRemediation
);

router.patch(
    "/:id/acknowledge",
    auth,
    controller.acknowledgeIncident
);

router.patch(
    "/:id/resolve",
    auth,
    controller.resolveIncident
);

router.get(
    "/",
    auth,
    controller.getAllIncidents
);

module.exports = router;