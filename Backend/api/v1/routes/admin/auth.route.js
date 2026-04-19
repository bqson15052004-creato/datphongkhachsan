const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/auth.controller');

const authValidate = require("../../validate/admin/auth.validate");

router.post("/auth/register", authValidate.register, controller.register);
router.post("/auth/login", authValidate.login, controller.login);

module.exports = router;