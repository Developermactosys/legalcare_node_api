const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { getWaitingList} = require("../../controller/list_controller/waitingList.controller");
const {expert_list } = require("../../controller/list_controller/expert_list.controller")
// const { } = require("../../controller/list_controller")

const { change_expert_status } = require("../../controller/list_controller/change_status.controller")


router.get('/get_waiting_list',uploads.none(), getWaitingList);
router.post('/expert_list',uploads.none(),expert_list);
router.post('/change_status',uploads.none(),change_expert_status)
// router.get('/user_chatlist',uploads.none(), getUserChatList);
module.exports = router;