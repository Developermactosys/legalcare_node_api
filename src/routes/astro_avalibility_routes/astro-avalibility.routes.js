const express = require("express")
const router = express.Router()
const {uploads} = require('../../middleware/multer');

const { astro_profile_update} = require("../../controller/astro_avalibility_controller/astro_profile_update.controller");
const { approveAstroChatRequest} = require("../../controller/astro_avalibility_controller/approve_astro_chat_request.controller")
const { rejectAstroChatRequest} = require("../../controller/astro_avalibility_controller/reject_astro_chat_request.controller");

router.post('/astro_profile_update',uploads.none(), astro_profile_update)
router.post('/approve_astro_chat_request', uploads.single('profile_image'), approveAstroChatRequest)
router.post('/reject_astro_chat_request', uploads.single('profile_image'), rejectAstroChatRequest)

module.exports = router;