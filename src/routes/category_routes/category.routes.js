const express = require("express");

const router = express.Router();
const {uploads} = require('../../middleware/multer');

const { createCategory,getCategory,getCategoryById,updateCategory,deleteCategory } = require("../../controller/category_controller/category.controller")

const {createSubCategory,getSubCategory
      ,getSubCategoryById,updateSubCategory, deleteSubCategory} = require("../../controller/category_controller/subcategory.controller")

//category Routes
router.post("/add_category", uploads.single('image'),createCategory);
router.get("/view_all_category", uploads.none(),getCategory);
router.get("/get_category/:id", uploads.none(), getCategoryById);
router.patch("/update_category/:id", updateCategory);
router.delete("/del_category/:id",deleteCategory)

//subcategory Routes
router.post("/add_subcategory",uploads.single("subcategory_img"),createSubCategory);  
  router.get("/view_all_subcategory", getSubCategory);
  router.get("/get_subcategory_by_id", getSubCategoryById);
  router.patch("/update_subcategory/:id", updateSubCategory);
router.delete("/del_subcategory/:id",deleteSubCategory)
module.exports= router;