const express=require("express");

const router=express.Router();

const auth=
require("../middleware/auth.middleware");

const controller=
require("../controllers/check.controller");

router.get(

"/:id/history",

auth,

controller.getHistory

);

module.exports=router;