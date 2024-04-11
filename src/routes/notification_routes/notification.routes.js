const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { view_notification ,update_notification} = require("../../controller/notification_controller/notification.controller")

router.get("/view_notification",uploads.none(),view_notification)

router.patch("/update_notification",uploads.none(),update_notification)

module.exports = router;