const express = require("express")
const router = express.Router()
const { createClientTestimonial,getClientTestimonials } = require("../../controller/testimonial_controller/testimonial.controller");
const { uploads } = require("../../middleware/multer");

router.post("/add_testimonials",uploads.single('cover_img'),createClientTestimonial );
router.get("/get_all_testimonials",getClientTestimonials)

module.exports = router