const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');


const {Admin_login} = require("../../controller/admin_controller/admin_login.controller");
const {totalUser, getuserDetails
    ,delUserDetails,searchUser,totalUserForCa} = require("../../controller/admin_controller/customer_crud.controller")

const { forgotPassword , resetPassword} = require("../../controller/admin_controller/forgetPassword.controller")    

router.post('/admin_login',uploads.none(),Admin_login); // Done 

router.get('/total_user', totalUser)  
router.get('/get_user_by_id/:UserId', getuserDetails)
router.delete('/del_user_by_id/:UserId', delUserDetails )
router.get('/get_search_user', searchUser)
router.get('/total_expert_list',totalUserForCa);

router.post("/forgotPassword", forgotPassword);
router.get("/resetPassword/:token", resetPassword);
module.exports = router;