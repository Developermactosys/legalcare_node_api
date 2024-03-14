const express = require('express');
const router = express.Router();
// const {uploads} = require('../../../middleware/multer');
 const { authorize } = require("../../../middleware/authorization")

// todays
const { todaysUserCount, todaysExpertCount, count_chat_for_today, count_chat_connections,
    count_call_for_today,count_video_call_for_today ,todayBookingData} = require("../../../controller/admin_controller/admin_dashboard/todays.controller")
router.get("/todays_customer_count", authorize(['0']),todaysUserCount)
router.get("/todays_expert_count", authorize(['0']),todaysExpertCount)
router.get("/todays_chat_count", authorize(['0']),count_chat_for_today);
router.get("/count_chat_connections", authorize(['0']), count_chat_connections);
router.get("/todays_call_count", authorize(['0']),count_call_for_today)
router.get("/todas_vedio_call_count", authorize(['0']),count_video_call_for_today);
router.get("/todays_booking", authorize(['0']),todayBookingData);

// total 
const { totalUser, totalExpert, count_total_chat, getTotalCall,getTotalVideo } = require('../../../controller/admin_controller/admin_dashboard/total.controller')

router.get('/get_total_user', authorize(['0']), totalUser)
router.get('/get_total_expert', authorize(['0']), totalExpert)
router.get('/get_total_chat', authorize(['0']), count_total_chat)
router.get('/get_total_call', authorize(['0']), getTotalCall)
router.get("/get_total_vedio_call", authorize(['0']),getTotalVideo);




module.exports = router;