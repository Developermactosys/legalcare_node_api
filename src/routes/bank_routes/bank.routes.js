const express = require('express');
const router = express.Router();
const { uploads } = require('../../middleware/multer');

const { saveBankDetails, getBankDetails, getBankDetailsById, updateBankDetails} = require("../../controller/bank_detail_controller/bank_detail.controller");

// Routes
router.post('/save_bank_details', uploads.fields([
  { name: 'pan_doc', maxCount: 1 },
  { name: 'aadhar_doc', maxCount: 1 },
  { name: 'passbook_img', maxCount: 1 },
  { name: 'certificate_of_membership', maxCount:1},
  { name: 'certificate_of_practice', maxCount: 1}
]), saveBankDetails);
router.get('/get_bank_details', getBankDetails);
router.get('/get_bank_detail_by_id/:id', getBankDetailsById);
router.post('/update_bank_details', uploads.fields([{ name: 'pan_doc', maxCount: 1 }, { name: 'aadhar_doc', maxCount: 1 }, { name: 'passbook_img', maxCount: 1 },  { name: 'certificate_of_membership', maxCount:1},
{ name: 'certificate_of_practice', maxCount: 1}]), updateBankDetails);

module.exports = router;
