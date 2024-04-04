const express = require('express')
const router = express.Router();

const { settingAdmin, changePassword, changeTheme, footerSetting,settingForAdmin,getAdminSetting,otp_Verify} = require('../../controller/setting_controller/setting.controller')
const { uploads} = require('../../middleware/multer')

router.patch('/general_setting',uploads.none(),settingAdmin )
router.patch('/change_password',uploads.none(), changePassword)
router.post('/change_theme', uploads.fields([{name:'favicon_img', maxCount:1}, {name:'logo_img', maxCount:1}]),changeTheme)
router.post('/add_footer_sec', uploads.none(), footerSetting)
router.post('/admin_setting',uploads.none(), settingForAdmin)
router.get('/get_admin_data', getAdminSetting)
router.post('/otp_verify_landing_user',uploads.none(), otp_Verify)

module.exports = router;
