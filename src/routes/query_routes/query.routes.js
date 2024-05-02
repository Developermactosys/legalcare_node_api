const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { getDetails} = require("../../controller/query_controller/query.controller");
const { userQueries} = require("../../controller/query_controller/user_query.controller")
const {submitQuery ,getAllSubmitQuery,getAllSubmitQueryForExpert,updateStatusQuery} = require('../../controller/query_controller/submit_query.controller')

 router.get('/query',uploads.none(), getDetails);
router.get('/user-queries',uploads.none(), userQueries);
router.post('/submit_query',uploads.single('query_img'),submitQuery)

router.get('/get_customer_query', getAllSubmitQuery)
router.get('/get_expert_query', getAllSubmitQueryForExpert)
router.put('/update_status_for_query', updateStatusQuery)
module.exports = router;