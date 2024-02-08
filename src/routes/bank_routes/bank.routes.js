const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');


const { saveBankDetails} = require("../../controller/bank_detail_controller/bank_detail.controller");

router.post('/save_bank_details',uploads.none(),saveBankDetails); // Done 

module.exports = router;