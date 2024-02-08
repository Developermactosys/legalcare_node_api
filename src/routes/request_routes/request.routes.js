const express = require("express")
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { sendRequest} = require("../../controller/request_controller/send_request.controller")
const { approveRequest} = require("../../controller/request_controller/approve_request.controller");
const { cancelRequest } = require("../../controller/request_controller/reject_request.controller")

router.post('/send_request', uploads.single('profile_image'), sendRequest)
router.post('/approve_request', uploads.single('profile_image'), approveRequest)
router.post('/cancle_request', uploads.single('profile_image'), cancelRequest)

module.exports = router;