

const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/account.controller");

router.get("/account", controller.index);

module.exports = router;
