const express = require("express");

const controller =
require("../controllers/metrics.controller");

const router =
express.Router();

/*
|--------------------------------------------------------------------------
| Live Local System Metrics
|--------------------------------------------------------------------------
|
| Returns CPU, memory, disk and network metrics from
| the machine running Minerva Sentinel.
|
| IMPORTANT:
| This route must appear before "/:hostname".
|
*/

router.get(

    "/system",

    controller.system

);

/*
|--------------------------------------------------------------------------
| Receive Metrics
|--------------------------------------------------------------------------
|
| Used by monitoring agents to send metrics
| to the Minerva Sentinel backend.
|
*/

router.post(

    "/",

    controller.create

);

/*
|--------------------------------------------------------------------------
| Metric History
|--------------------------------------------------------------------------
|
| IMPORTANT:
| This route MUST come before "/:hostname"
| otherwise Express will think "history"
| is a hostname.
|
*/

router.get(

    "/history",

    controller.history

);

/*
|--------------------------------------------------------------------------
| Latest Metrics (All Hosts)
|--------------------------------------------------------------------------
*/

router.get(

    "/latest",

    controller.latest

);

/*
|--------------------------------------------------------------------------
| Latest Metrics (Single Host)
|--------------------------------------------------------------------------
*/

router.get(

    "/:hostname",

    controller.latestByHostname

);

module.exports = router;