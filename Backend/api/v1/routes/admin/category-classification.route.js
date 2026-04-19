const express = require("express");
const router = express.Router();


const controller = require("../../controllers/admin/category-classification.controller");

const classificationValidate = require("../../validate/admin/category-classification.validate");

router.get("/category-classification", controller.index);
router.post("/category-classification/create", classificationValidate.create, controller.create);


module.exports = router;
