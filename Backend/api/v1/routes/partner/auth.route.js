const express = require('express');
const router = express.Router();

const controller = require("../../controllers/partner/auth.controller");

const authValidate = require("../../validate/partner/auth.validate");

router.post("/auth/register", authValidate.register, controller.register);
router.post("/auth/login", authValidate.login, controller.login);
// router.post("/auth/hotel", controller.hotel);
// router.post("/auth/refresh", controller.refreshToken);





module.exports = router;