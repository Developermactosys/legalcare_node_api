const express = require('express')
const router = express.Router()

const { createUser,otp_Verify} = require('../../controller/demo/demo_landing.controller')
const { contactUs,getContactUs} = require("../../controller/demo/contact_us_controller")
const { uploads} = require('../../middleware/multer')

router.post('/creater_user_landing', uploads.none(), createUser)
router.post("/otp_verify_for_landing", uploads.none(),otp_Verify)

router.post('/add_contact_us', uploads.none(), contactUs)
router.get('/get_conact_us_details', getContactUs)
module.exports = router;