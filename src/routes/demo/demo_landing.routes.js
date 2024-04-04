const express = require('express')
const router = express.Router()

const { createUser,otp_Verify} = require('../../controller/demo/demo_landing.controller')
const { uploads} = require('../../middleware/multer')

router.post('/creater_user_landing', uploads.none(), createUser)
router.post("/otp_verify_for_landing", uploads.none(),otp_Verify)
module.exports = router;