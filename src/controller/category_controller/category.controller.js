
const db = require("../../../config/db.config");
const Category = db.category;
const subcategory = db.subcategory;

// API for create category
const createCategory = async (req, res) => {
  const { id, category_name, description, color, status } = req.body;
  try {
    const filePath = req.file
      ? `category_img/${req.file.filename}`
      : "/src/uploads/category_img/default.png";

    const addCategory = await Category.create({
      category_name,
      status,
      description,
      color,
      category_image: filePath,
    });

    return res.status(200).json({
      status: true,
      message: "Category add successfully....",
      data: addCategory,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Get Category Api
const getCategory = async (req, res) => {
  try {
    const category = await Category.findAll({
      include:[{
        model: subcategory,
        as: "subcategory",
      }]
    });

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Categories retrieved successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
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
      include:[{
        model: subcategory,
        as: "subcategory",
      }]
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
  const { category_name, description, color, status } = req.body;
  if (!req.param.id) {
    return res.json({
      status: false,
      message: "provide category id",
    });
  }
  try {
    const filePath = req.file
      ? `category_img/${req.file.filename}`
      : "/src/uploads/category_img/default.png";

    const category = await Category.findOne({
      where: { id: req.param.id },
    });
    if (category) {
      const update = await Category.update(
        {
          category_name,
          status,
          description,
          color,
          category_image: filePath,
        },
        {
          where: { id: req.param.id },
        }
      );
      if (update) {
        return res.json({
          status: true,
          message: "category update successfully ",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// delete category by id
const deleteCategory = async (req, res) => {
    if (!req.params.id) {
      return res.status(400).json({
        status: false,
        message: "Category id required",
      });
    }
    try {
      const rowsDeleted = await Category.destroy({
        where: { id: req.params.id },
      });
      if (rowsDeleted > 0) {
        return res.json({
          status: true,
          message: "Category deleted successfully",
        });
      }
      return res.status(404).json({
        status: false,
        message: "Category not found or already deleted",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
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
