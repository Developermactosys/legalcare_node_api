const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { getDetails} = require("../../controller/query_controller/query.controller");
const { userQueries} = require("../../controller/query_controller/user_query.controller")
const {submitQuery } = require('../../controller/query_controller/submit_query.controller')

 router.get('/query',uploads.none(), getDetails);
router.get('/user_queries',uploads.none(), userQueries);
router.post('/submit_query',uploads.none(),submitQuery)

module.exports = router;