const express = require("express");

const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { createCategory } = require("../../controller/category_controller/add_category.controller")

router.post("/add_category", uploads.single('category_img'),createCategory);

module.exports= router;