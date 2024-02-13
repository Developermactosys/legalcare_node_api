
const db = require("../../../config/db.config");
const Category = db.category;

// API for create category
const createCategory = async (req, res) => {
  const { id, categoryName, description, color, status } = req.body;
  try {
    const filePath = req.file
      ? `/src/uploads/category_img/${req.file.filename}`
      : "/src/uploads/category_img/default.png";

    const addCategory = await Category.create(req.body);

    return res.status(200).json({
      success: true,
      message: "Category add successfully....",
      data: addCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Category Api
const getCategory = async (req, res) => {
  try {
    const category = await Category.findAll({});

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get category by id
const getCategoryById = async (req, res) => {
  if (!req.params.id) {
    return res.json({
      success: false,
      message: "category is Not provide",
    });
  }
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// updateCategory Api
const updateCategory = async (req, res) => {
  const { categoryName, description, color, status } = req.body;
  if (!req.param.id) {
    return res.json({
      success: false,
      message: "provide category id",
    });
  }
  try {
    const filePath = req.file
      ? `/src/uploads/category_img/${req.file.filename}`
      : "/src/uploads/category_img/default.png";

    const category = await Category.findOne({
      where: { id: req.param.id },
    });
    if (category) {
      const update = await Category.update(
        {
          categoryName,
          status,
          description,
          color,
          category_img: filePath,
        },
        {
          where: { id: req.param.id },
        }
      );
      if (update) {
        return res.json({
          success: true,
          message: "category update successfully ",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete category by id
const deleteCategory = async (req, res) => {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Category id required",
      });
    }
    try {
      const rowsDeleted = await Category.destroy({
        where: { id: req.params.id },
      });
      if (rowsDeleted > 0) {
        return res.json({
          success: true,
          message: "Category deleted successfully",
        });
      }
      return res.status(404).json({
        success: false,
        message: "Category not found or already deleted",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  getCategoryById,
  deleteCategory
};
