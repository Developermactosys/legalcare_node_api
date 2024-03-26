
const db = require("../../../config/db.config");
const Category = db.category;
const subcategory = db.subcategory;
const User = db.User;
const {Sequelize,Op,contains,QueryTypes,sequelize } = require("sequelize");

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

// Get all Category Api
const getCategory = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const category = await Category.findAll({
      include:[{
        model: subcategory,
        as: "subcategory",
      }],
      limit: limit,
      offset: offset,
    });
    const totalCount = await Category.count({});
    const totalPages = Math.ceil(totalCount / limit);

    if (!category) {
      return res.status(200).json({
        status: false,
        message: "Category not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Categories retrieved successfully",
      data: category,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// get category by id including subcategory
const getCategoryById = async (req, res) => {
  if (!req.params.id) {
    return res.json({
      status: false,
      message: "category is Not provide",
    });
  }
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const category = await Category.findOne({
      where: {
        id: req.params.id,
      }, 
      include:[{
        model: subcategory,
        as: "subcategory",
      }],
      limit: limit,
      offset: offset,
    });
    const totalCount = await Category.count({});
    const totalPages = Math.ceil(totalCount / limit);

    if (!category) {
      return res.status(200).json({
        status: false,
        message: "Category not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Categories retrieved successfully",
      data: category,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};



// API for get all Categories
// const getCategory = async (req, res) => {
//   try {
//     // Find all categories
//     const categories = await Category.findAll();
//     // If no categories are found, return 404
//     if (!categories || categories.length === 0) {
//       return res.status(200).json({
//         status: false,
//         message: "No categories found",
//       });
//     }
//     // Initialize array to store category-user pairs
//     const data = [];
//     // Loop through each category
//     for (const category of categories) {
//       // Find users for the current category
//       const users = await User.findAll({
//         where: {
//           [Sequelize.Op.and]: [
//             Sequelize.literal(`JSON_CONTAINS(category_of_expert, '${category.id}')`),
//             Sequelize.where(
//               Sequelize.fn('JSON_TYPE', Sequelize.col('category_of_expert')),
//               'ARRAY'
//             )
//           ]
//         }
//       });
//       // Push category and associated users to the data array
//       data.push({
//         category: category,
//         users: users,
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       message: "Categories with associated users retrieved successfully",
//       data: data,
//     });
//   } catch (error) {
//     // Return 500 status code if an error occurs
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };



// API for get Category By Id
// const getCategoryById = async (req, res) => {
//   if (!req.params.id) {
//     return res.json({
//       status: false,
//       message: "Category ID is not provided",
//     });
//   }
//   try {
//     // Find the category by its ID
//     const category = await Category.findOne({
//       where: {
//         id: req.params.id,
//       }
//     });

//     // If category is not found, return 404
//     if (!category) {
//       return res.status(200).json({
//         status: false,
//         message: "Category not found",
//       });
//     }

//     // Find users whose expertise category includes the target category ID
//     const users = await User.findAll({
//       where: {
//         [Sequelize.Op.and]: [
//           Sequelize.literal(`JSON_CONTAINS(category_of_expert, '${category.id}')`),
//           Sequelize.where(
//             Sequelize.fn('JSON_TYPE', Sequelize.col('category_of_expert')),
//             'ARRAY'
//           )
//         ]
//       }
//     });

//     return res.status(200).json({
//       status: true,
//       message: "Users with the specified category retrieved successfully",
//       data: {
//         category: category,
//         users: users,
//       },
//     });
//   } catch (error) {
//     // Return 500 status code if an error occurs
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };


// updateCategory Api
const updateCategory = async (req, res) => {
  const { category_name, description, color, status } = req.body;
  if (!req.params.id) {
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
      where: { id: req.params.id },
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
          where: { id: req.params.id },
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
      return res.status(200).json({
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
      return res.status(200).json({
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
