const router = require('express').Router()
const {uploads} = require('../../middleware/multer');


const { get_earning_by_userType} = require('../../controller/earning_controller/earning.controller')


router.get('/get_earning_by_user_type',get_earning_by_userType)

module.exports = router;