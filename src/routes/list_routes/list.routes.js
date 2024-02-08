const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { getWaitingList} = require("../../controller/list_controller/waitingList.controller");
const {freeAstrologerList } = require("../../controller/list_controller/free_astrologer_list.controller")
// const { } = require("../../controller/list_controller")

router.post('/get_waiting_list',uploads.none(), getWaitingList);
router.post('/astrologer_list',uploads.none(), freeAstrologerList);
// router.get('/user_chatlist',uploads.none(), getUserChatList);
module.exports = router;