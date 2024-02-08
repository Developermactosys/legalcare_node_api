const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { addCallChat} = require("../../controller/call_controller/add_call_chat.controller")
const {viewCallChat } = require("../../controller/call_controller/view_call_chat.controller");
const { callHistoryController} =require("../../controller/call_controller/call_details.controller")
const { getCallStatus} = require("../../controller/call_controller/get_call_status.controller")

router.post('/add_call_chat',uploads.none(), addCallChat);// Done 
router.post('/view_call_chat',uploads.none(), viewCallChat);// Done 
router.post('/call_history',uploads.none(), callHistoryController); // Done
router.post('/get_call_status',uploads.none(), getCallStatus); // Done
module.exports = router;