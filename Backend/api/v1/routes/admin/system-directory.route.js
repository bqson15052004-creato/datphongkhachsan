const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/system-directory.controller');

const systemDirectoryValidate = require('../../validate/admin/system-directory.validate');

router.get('/system-directory', controller.index);
router.post('/system-directory/create', systemDirectoryValidate.create, controller.create);


module.exports = router;

