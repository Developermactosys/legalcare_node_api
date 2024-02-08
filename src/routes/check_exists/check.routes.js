const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const {checkExists } = require("../../controller/check_exists_controller/check_exists.controller")

router.post('/check_exists',uploads.none(), uploads.none(), checkExists);

module.exports = router;