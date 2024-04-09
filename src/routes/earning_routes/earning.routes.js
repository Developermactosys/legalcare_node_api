const express = require('express');
const router = express.Router();
const { uploads } = require('../../middleware/multer');

const { get_earning_by_userType ,getAdminEarning,get_earning_by_expert_id} = require('../../controller/earning_controller/earning.controller');

// Define your route
router.get('/get_earning_by_user_type', (req, res) => {
  
  get_earning_by_userType(req, res);
});

router.get("/get_admin_earning",getAdminEarning)
router.get("/get_earning_by_expert_id",get_earning_by_expert_id)

module.exports = router;
