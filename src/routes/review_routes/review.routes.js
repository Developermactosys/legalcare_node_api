const express = require("express")

const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { postAstroReview,getAstroReviewList} = require("../../controller/review_controller/review.controller");

router.post('/astro_review',uploads.none(),postAstroReview);
router.post('/astro_review_list',uploads.none(), getAstroReviewList);

module.exports = router