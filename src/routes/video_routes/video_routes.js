const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { add_video_call } = require("../../controller/video_controller/add_video")
const {view_call_details } = require("../../controller/call_controller/view_call_chat.controller");
const { callHistoryController} =require("../../controller/call_controller/call_details.controller")
const { getCallStatus} = require("../../controller/call_controller/get_call_status.controller")

router.post('/add_call_chat',uploads.none(), add_video_call);// Done 
router.post('/view_call_details',uploads.none(), view_call_details);// Done 
router.post('/call_history',uploads.none(), callHistoryController); // Done
router.post('/get_call_status',uploads.none(), getCallStatus); // Done
module.exports = router;