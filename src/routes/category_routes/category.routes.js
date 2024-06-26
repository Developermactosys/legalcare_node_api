const express = require("express");

const router = express.Router();
const {uploads} = require('../../middleware/multer');
// const { authorize } = require("../../middleware/authorization")

const { createCategory,getCategory,getCategoryById,updateCategory,deleteCategory ,get_all_category} = require("../../controller/category_controller/category.controller")

const {createSubCategory,getSubCategory
      ,getSubCategoryById,updateSubCategory, deleteSubCategory,getSubCategoryBy_categoryId,get_all_SubCategory} = require("../../controller/category_controller/subcategory.controller")

//category Routes
router.post("/add_category" ,uploads.single('category_image'),createCategory);
router.get("/view_all_category", uploads.none(),getCategory);
router.get("/get_category/:id", uploads.none(), getCategoryById);
router.patch("/update_category/:id",uploads.single('category_image'),updateCategory);
router.delete("/del_category/:id",deleteCategory)
// without pagination for admin side
router.get("/get_all_category",get_all_category)

//subcategory Routes
router.post("/add_subcategory",uploads.single("subcategory_img"),createSubCategory);  
  router.get("/view_all_subcategory", getSubCategory);
  router.get("/get_subcategory_by_id", getSubCategoryById);
  router.patch("/update_subcategory/:id", uploads.single("subcategory_img"), updateSubCategory);
router.delete("/del_subcategory/:id",deleteSubCategory)
router.get("/get_subcategory_by_categoryId",getSubCategoryBy_categoryId);
// without pagination for admin side
router.get("/get_all_subcategory",get_all_SubCategory)

module.exports= router;