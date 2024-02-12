const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const {updateChatStatus } = require("../../controller/chat_controller/chat_status_update.controller")
const {getChatStatus } = require("../../controller/chat_controller/get_chat_status.controller")
const { sendUserChatRequest} = require("../../controller/chat_controller/send_user_chat_request.controller")
const { rejectUserChatRequest} = require("../../controller/chat_controller/reject_user_chat_request.controller")
const { getChatList_by_user_id } = require("../../controller/chat_controller/chat_list.controller");


router.post('/send_user_chat_request/:request_id',uploads.none(), sendUserChatRequest);// Done 
router.post('/reject_user_chat_request',uploads.none(), rejectUserChatRequest);// Done
router.get('/chat_active_status',uploads.none(),getChatStatus);
router.post('/chat_status_update',uploads.none(), updateChatStatus);
router.post('/get_chat_list_by_user_id',uploads.none(), getChatList_by_user_id);

module.exports = router;