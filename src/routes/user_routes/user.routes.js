const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { registration,otpVerify, store_otp } = require("../../controller/user_controller/registration.controller");
 const { login } = require("../../controller/user_controller/login.controller");
 const {edit_user } = require("../../controller/user_controller/edit_user.controller")

router.post('/registration',uploads.single('profile_image'), registration);
router.post('/otp_verify', uploads.none(), otpVerify)
router.post('/login', uploads.none(), login)

router.post('/update_details',uploads.fields(([
    { name: 'document_for_academy', maxCount: 1 },
    { name: 'document_for_tutor', maxCount: 1 },
    { name: 'profile_image', maxCount: 1 }])),edit_user)

router.post('/store_otp', uploads.none(), store_otp)


module.exports = router;