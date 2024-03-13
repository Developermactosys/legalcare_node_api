const express = require('express');
const router = express.Router();
// const {uploads} = require('../../../middleware/multer');
// const { authorize } = require("../../../middleware/authorization")

// todays
const { todaysUserCount, todaysExpertCount, count_chat_for_today, count_chat_connections,
    count_call_for_today,count_video_call_for_today ,todayBookingData} = require("../../../controller/admin_controller/admin_dashboard/todays.controller")
router.get("/todays_customer_count",todaysUserCount)
router.get("/todays_expert_count",todaysExpertCount)
router.get("/todays_chat_count",count_chat_for_today);
router.get("/count_chat_connections", count_chat_connections);
router.get("/todays_call_count",count_call_for_today)
router.get("/todas_vedio_call_count",count_video_call_for_today);
router.get("/todays_booking",todayBookingData);

// total 
const { totalUser, totalExpert, count_total_chat, getTotalCall,getTotalVideo } = require('../../../controller/admin_controller/admin_dashboard/total.controller')

router.get('/get_total_user', totalUser)
router.get('/get_total_expert', totalExpert)
router.get('/get_total_chat', count_total_chat)
router.get('/get_total_call', getTotalCall)
router.get("/get_total_vedio_call",getTotalVideo);




module.exports = router;