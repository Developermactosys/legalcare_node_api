const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { getWaitingList} = require("../../controller/list_controller/waitingList.controller");
const {expert_list } = require("../../controller/list_controller/expert_list.controller")
// const { } = require("../../controller/list_controller")

router.get('/get_waiting_list',uploads.none(), getWaitingList);
router.post('/expert_list',uploads.none(), expert_list);
// router.get('/user_chatlist',uploads.none(), getUserChatList);
module.exports = router;