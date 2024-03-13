const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { registration,otpVerify, store_otp } = require("../../controller/user_controller/registration.controller");
const { login } = require("../../controller/user_controller/login.controller");
const { resetPasswordController} = require("../../controller/user_controller/resetPassword.controller");
const { edit_user,view_user} = require("../../controller/user_controller/edit_user.controller");
const { logoutUpdate} = require("../../controller/user_controller/logout.controller");
const { addFollowUsers } = require("../../controller/user_controller/add_follow_user.controller");
const { updateDeviceId } = require("../../controller/user_controller/dashboard_device_id.controller")
router.post('/registration',uploads.single('profile_image'), registration);
router.post('/otp_verify', uploads.none(), otpVerify)
router.post('/login', uploads.none(), login)
router.post('/reset_password',uploads.none(), resetPasswordController);
router.post('/edit_user',uploads.single('profile_image'),edit_user);
router.post('/logoutUpdate',uploads.none(),logoutUpdate) // Done 
router.post('/view_users',uploads.none(),view_user);
router.post('/store_otp', uploads.none(), store_otp)

router.post('/add_follow_user',uploads.none(), addFollowUsers);
// dashboard_update_device_id
router.post('/update_device_id', uploads.none(), updateDeviceId)
module.exports = router;