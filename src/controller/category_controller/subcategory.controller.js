// sub category controller
const db = require("../../../config/db.config");
const subcategory = db.subcategory;     

const createSubCategory = async (req, res) => {
  const { id, subcategoryName, description, color, status } = req.body;
  try {
    const filePath = req.file
      ? `subcategory_img/${req.file.filename}`
      : "/src/uploads/subcategory_img/default.png";
    const addSubCategory = await subcategory.create({
      subcategoryName,
      status,
      description,
      color,
      subcategory_img: filePath,
      id,
    });
    return res.status(200).json({
      success: true,
      message: "subcategory add successfully....",
      data: addSubCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get subCategory Api
const getSubCategory = async (req, res) => {
  try {
    const sub_category = await subcategory.findAll({});

    if (sub_category.length <= 0) {
      return res.status(204).json({
        status: false,
        code: 204,
        message: "subcategory not found",
      });
    }
    return res.status(200).json({
      status: true,
      code: 200,
      message: "subcategory get Successfully",
      data: sub_category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get sub category by id
const getSubCategoryById = async (req, res) => {
  if (!req.params.id) {
    return res.json({
      success: false,
      message: "subcategory id required",
    });
  }
  try {
    const sub_category = await subcategory.findOne({
      where: { id: req.params.id },
    });
    if (!sub_category) {
      return res.status(404).json({
        success: false,
        message: "subcategory not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: sub_category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update sub category api
const updateSubCategory = async (req, res) => {
  const { subcategoryName, description, color, status } = req.body;
  if (!req.params.id) {
    return res.json({
      success: false,
      message: "subcategory id required",
    });
  }
  try {
    const filePath = req.file
      ? `subcategory_img/${req.file.filename}`
      : "/src/uploads/subcategory_img/default.png";

    const find = await subcategory.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!find) {
      return res.json({
        success: false,
        message: "id wrong",
      });
    }

    const sub_category = await subcategory.update(
      {
        subcategoryName,
        status,
        description,
        color,
        subcategory_img: filePath,
      },
      { where: { id: req.params.id } }
    );
    if (sub_category) {
      return res.status(200).json({
        success: true,
        message: "subcategory update successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete Subcategory 
const deleteSubCategory = async (req, res) => {
    if (!req.params.id) {
      return res.json({
        success: false,
        message: "subcategory id required",
      });
    }
    try {
      const sub_category = await subcategory.destroy({
        where: { id: req.params.id },
      });
  
      if (sub_category > 0) {
        return res.json({
          success: true,
          message: "Subcategory deleted successfully",
        });
      } else {
        return res.json({
          success: false,
          message: "Subcategory not found or delete operation failed",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
module.exports = {
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  getSubCategoryById,
  deleteSubCategory
};
