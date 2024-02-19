const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const {addWalletAmount , transaction_details } = require("../../controller/wallet_controller/add_wallet_amt.controller")
const {viewWalletBalance } = require("../../controller/wallet_controller/view_wallet_amt.controller")
const { deductWalletAmount}= require("../../controller/wallet_controller/deduct_wallet_amt.controller")
const { withdrawalAmount} = require("../../controller/wallet_controller/withdrawal.controller")

router.post('/add_wallet_amt',uploads.none(), addWalletAmount);
router.post('/view_wallet_bal',uploads.none(), viewWalletBalance);
router.post('/wallet_amount_deduct',uploads.none(), deductWalletAmount);
router.get('/recharge-history', uploads.none(), transaction_details)

router.get("/withdrawal",uploads.none(),withdrawalAmount)
module.exports = router;