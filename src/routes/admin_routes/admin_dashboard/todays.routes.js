const express = require('express');
const router = express.Router();
// const {uploads} = require('../../../middleware/multer');
// const { authorize } = require("../../../middleware/authorization")


const {todaysUserCount , todaysExpertCount ,todaysChatCount} = require("../../../controller/admin_controller/admin_dashboard/todays.controller")
router.get("/todays_customer_count",todaysUserCount)
router.get("/todays_expert_count",todaysExpertCount)
router.get("/todays_chat_count",todaysChatCount);

module.exports = router;