const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');


const { saveBankDetails ,getBankDetails,getBankDetailsById} = require("../../controller/bank_detail_controller/bank_detail.controller");


router.post('/save_bank_details',uploads.none(),saveBankDetails); // Done 
router.get('/get_bank_details',getBankDetails)
router.get('get_bank_detail_by_id/:id',getBankDetailsById);

module.exports = router;
