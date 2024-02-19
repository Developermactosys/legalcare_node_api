const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const {getStaticData } = require("../../controller/static_controller/static_data.controller")

router.get('/static_data',getStaticData);

module.exports = router;