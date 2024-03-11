const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { add_video_call,view_video_details,videoHistoryController,getVideoStatus } = require("../../controller/video_controller/add_video")

router.post('/add_video_call',uploads.none(), add_video_call);// Done 
router.post('/view_video_details',uploads.none(), view_video_details);// Done 
router.post('/video_history',uploads.none(), videoHistoryController); // Done
router.post('/get_call_status',uploads.none(), getVideoStatus); // Done


module.exports = router;