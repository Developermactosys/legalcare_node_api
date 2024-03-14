const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');
const { authorize } = require("../../middleware/authorization");

const {Admin_login} = require("../../controller/admin_controller/admin_login.controller");
const {totalUser, getuserDetails
    ,delUserDetails,searchUser,totalUserForCa,getuserDetailsAndChat} = require("../../controller/admin_controller/customer_crud.controller")

const { forgotPassword , resetPassword} = require("../../controller/admin_controller/forgetPassword.controller")    

router.post('/admin_login',uploads.none(),Admin_login); // Done 

router.get('/total_user', authorize(['0']),totalUser);  
router.get('/get_user_by_id/:UserId', authorize(['0']), getuserDetails);
router.delete('/del_user_by_id/:UserId', authorize(['0']), delUserDetails );
router.get('/get_search_user', authorize(['0']), searchUser);
router.get('/total_expert_list', authorize(['0']),totalUserForCa);

router.post("/forgotPassword", forgotPassword);
router.get("/resetPassword/:token", resetPassword);

router.get('/get_user_and_chat/:UserId', authorize(['0']), getuserDetailsAndChat);

module.exports = router;