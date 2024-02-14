const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const {addWalletAmount } = require("../../controller/wallet_controller/add_wallet_amt.controller")
const {viewWalletBalance } = require("../../controller/wallet_controller/view_wallet_amt.controller")
const { deductWalletAmount}= require("../../controller/wallet_controller/deduct_wallet_amt.controller")

router.post('/add_wallet_amt',uploads.none(), addWalletAmount);
router.post('/view_wallet_bal',uploads.none(), viewWalletBalance);
router.post('/wallet_amount_deduct',uploads.none(), deductWalletAmount);
module.exports = router;