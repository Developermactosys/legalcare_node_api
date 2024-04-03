const express = require('express')
const router = express.Router();

const { settingAdmin, changePassword, changeTheme, footerSetting} = require('../../controller/setting_controller/setting.controller')
const { uploads} = require('../../middleware/multer')

router.patch('/general_setting',uploads.none(),settingAdmin )
router.patch('/change_password',uploads.none(), changePassword)
router.post('/change_theme', uploads.fields([{name:'favicon_img', maxCount:1}, {name:'logo_img', maxCount:1}]),changeTheme)
router.post('/add_footer_sec', uploads.none(), footerSetting)

module.exports = router;
