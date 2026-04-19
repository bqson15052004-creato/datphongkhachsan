const express = require("express");
const router = express.Router();

const controller = require("../../controllers/partner/hotel.controller");

router.get("/hotel", controller.index);
router.post("/hotel/create", controller.create);


module.exports = router;
