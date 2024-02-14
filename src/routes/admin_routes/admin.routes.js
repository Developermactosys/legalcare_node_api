const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');


const {Admin_login} = require("../../controller/admin_controller/admin_login.controller");
const {totalUser, getuserDetails
    ,delUserDetails,searchUser} = require("../../controller/admin_controller/customer_crud.controller")

router.post('/admin_login',uploads.none(),Admin_login); // Done 

router.get('/total_user', totalUser)
router.get('/get_user_by_id/:UserId', getuserDetails)
router.delete('/del_user_by_id/:UserId', delUserDetails )
router.get('/get_search_user', searchUser)

module.exports = router;