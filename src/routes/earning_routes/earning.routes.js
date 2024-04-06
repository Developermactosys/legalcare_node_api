const express = require('express');
const router = express.Router();
const { uploads } = require('../../middleware/multer');

const { get_earning_by_userType ,getAdminEarning} = require('../../controller/earning_controller/earning.controller');

// Define your route
router.get('/get_earning_by_user_type', (req, res) => {
  
  get_earning_by_userType(req, res);
});

router.get("/get_admin_earning",getAdminEarning)
module.exports = router;
