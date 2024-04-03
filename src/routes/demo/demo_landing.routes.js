const express = require('express')
const router = express.Router()

const { createUser} = require('../../controller/demo/demo_landing.controller')
const { uploads} = require('../../middleware/multer')

router.post('/creater_user_landing', uploads.none(), createUser)

module.exports = router;