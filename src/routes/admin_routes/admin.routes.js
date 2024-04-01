const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');
const { authorize } = require("../../middleware/authorization");

const {Admin_login} = require("../../controller/admin_controller/admin_login.controller");
const {totalUser, getuserDetails
    ,delUserDetails,searchUser,totalUserForCa,getAllCallDetailById,getAllDocumentDetailById,getAllVideoCallDetailById} = require("../../controller/admin_controller/customer_crud.controller")

const { forgotPassword , resetPassword} = require("../../controller/admin_controller/forgetPassword.controller")    

router.post('/admin_login',uploads.none(),Admin_login); // Done 

router.get('/total_user', totalUser);  
router.get('/get_user_by_id/:UserId',  getuserDetails);
router.delete('/del_user_by_id/:UserId',  delUserDetails );
router.get('/get_search_user',  searchUser);
router.get('/total_expert_list', totalUserForCa);

router.post("/forgotPassword", forgotPassword); 
router.get("/resetPassword/:token", resetPassword);

// router.get('/get_user_and_chat/:UserId', authorize(['0']), getuserDetailsAndChat);

router.get('/get_all_call_list_by_id/:id', getAllCallDetailById)
router.get('/get_all_video_list_by_id/:id', getAllVideoCallDetailById)
router.get('/get_all_doc_list_by_id/:id', getAllDocumentDetailById)


module.exports = router;