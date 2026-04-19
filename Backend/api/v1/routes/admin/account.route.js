

const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/account.controller");


router.get("/account", controller.index);

router.get("/account/my-account/:id_user", controller.myAccount);



module.exports = router;
