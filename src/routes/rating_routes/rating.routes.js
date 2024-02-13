const express = require("express")

const router = express.Router();
const {uploads} = require('../../middleware/multer');


const { addRatingBar ,getAllRatings} = require("../../controller/rating_controller/rating.controller")

router.post("/add_rating",uploads.none(),addRatingBar)
router.get("/get_rating",uploads.none(),getAllRatings)

module.exports = router