const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const {addWalletAmount } = require("../../controller/wallet_controller/add_wallet_amt.controller")
const {viewWalletBalance } = require("../../controller/wallet_controller/view_wallet_amt.controller")
// const { } = require("../../controller/wallet_controller")


router.post('/add_wallet_amt',uploads.none(), addWalletAmount);
router.post('/view_wallet_bal',uploads.none(), viewWalletBalance);
// router.post('/wallet_amount_deduct',uploads.none(),walletAmountDeduct)

module.exports = router;