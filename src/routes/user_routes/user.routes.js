const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { registration,otpVerify } = require("../../controller/user_controller/registration.controller");
const { login } = require("../../controller/user_controller/login.controller");
const { resetPasswordController} = require("../../controller/user_controller/resetPassword.controller");
const { edit_user,view_user} = require("../../controller/user_controller/edit_user.controller");
const { logoutUpdate} = require("../../controller/user_controller/logout.controller");

router.post('/registration',uploads.single('profile_image'), registration);
router.post('/otp_verify', uploads.none(), otpVerify)
router.post('/login', uploads.none(), login)
router.post('/reset_password',uploads.none(), resetPasswordController);
router.post('/edit_user',uploads.none(),edit_user);
router.post('/logoutUpdate',uploads.none(),logoutUpdate) // Done 
router.get('/view_users',uploads.none(),view_user);
module.exports = router;