const express = require('express');
const router = express.Router();
// const {uploads} = require('../../../middleware/multer');
//  const { authorize } = require("../../../middleware/authorization")
const { getPaymentHistory,getPaymentHistoryById } = require("../../../controller/admin_controller/admin_dashboard/payment_history.controller")

 router.get('/get_payment', getPaymentHistory)
 router.get("/get_payment_by_id/:id",getPaymentHistoryById)
 


module.exports = router;