const express = require("express")

const router = express.Router();
const {uploads} = require('../../middleware/multer');

const {sendMessageWithImage} = require("../../controller/chat_controller/add_chat.controller");

router.post('/message_image',uploads.single("image"), sendMessageWithImage);

module.exports = router