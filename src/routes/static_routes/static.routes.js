const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const {getStaticData } = require("../../controller/static_controller/static_data.controller")
const {getLocation } = require("../../controller/static_controller/location.controller")

router.get('/static_data',getStaticData);
router.get("/get_location",getLocation);


module.exports = router;