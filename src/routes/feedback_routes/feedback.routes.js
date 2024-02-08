const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { feedbackController} = require("../../controller/feedback_controller/feedback.controller")

router.post('/feedback',uploads.none(),feedbackController);// Done 

module.exports = router;