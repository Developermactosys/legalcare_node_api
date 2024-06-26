// sub category controller
const { where } = require("sequelize");
const db = require("../../../config/db.config");
const subcategory = db.subcategory;     
const category = db.category;
const service = db.service;
const {Sequelize,Op,contains,QueryTypes,sequelize } = require("sequelize");


const createSubCategory = async (req, res) => {
  const { categoryId , subcategoryName, description, color, status,type_of_subcategory } = req.body;
  try {

    const find_subcategory_name = await subcategory.findOne({
      where:{ subcategoryName : subcategoryName}
    })
    if(find_subcategory_name){
      return res.status(200).json({status:false , message : "SubCategory name is Already exist "})
    }

    const filePath = req.file
      ? `subcategory_img/${req.file.filename}`
      : "/src/uploads/subcategory_img/default.png";
    const addSubCategory = await subcategory.create({
      subcategoryName,
      status,
      description,
      color,
      type_of_subcategory,
      subcategory_img: filePath,
      categoryId  : categoryId ,
    });
    return res.status(200).json({
      status: true,
      message: "subcategory add successfully....",
      data: addSubCategory,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// get subCategory Api
const getSubCategory = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const {type_of_subcategory} = req.query;
    let query = {
        where: {},
      };  
      if (type_of_subcategory) {
        query.where.type_of_subcategory = { [Sequelize.Op.like]: `%${type_of_subcategory}%` };
      }
    const sub_category = await subcategory.findAll({
      where: query.where,
include:[{
  model: category,
  as: "category",
},
{
  model:service,
  as:"service"
}
],
order: [["id", "DESC"]],
limit: limit,
offset: offset,
});

    const totalCount = await subcategory.count({});
    const totalPages = Math.ceil(totalCount / limit);


    if (!sub_category) {
      return res.status(204).json({
        status: false,
        code: 204,
        message: "subcategory not found",
      });
    }
    return res.status(200).json({
      status: true,
      code: 200,
      message: "subcategory get successfully",
      count:totalCount,
      data: sub_category,
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

// Get All category without pagination for admin side 
const get_all_SubCategory = async (req, res) => {
  try {
    const sub_category = await subcategory.findAll({
    attributes:['id','subcategoryName','subcategory_img'],
// include:[{
//   model: category,
//   as: "category",
// },
// {
//   model:service,
//   as:"service"
// }
// ],

});
    if (!sub_category) {
      return res.status(204).json({
        status: false,
        code: 204,
        message: "subcategory not found",
      });
    }
    return res.status(200).json({
      status: true,
      code: 200,
      message: "subcategory get successfully",
      data: sub_category,
      
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


// get sub category by id
const getSubCategoryById = async (req, res) => {
  if (!req.query.subcategory_id) {
    return res.json({
      status: false,
      message: "subcategory id required",
    });
  }
  try {
    const sub_category = await subcategory.findOne({
      where: { id: req.query.subcategory_id },
      include:[{
        model: category,
        as: "category",
      },
      {
        model:service,
        as:"service"
      }
    ]
    });
    if (!sub_category) {
      return res.status(404).json({
        status: false,
        message: "subcategory not found",
      });
    }
    return res.status(200).json({
      status: true,
      data: sub_category,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// get Subcategory by category_id

const getSubCategoryBy_categoryId = async (req, res) => {

  if (!req.query.category_id) {
    return res.json({
      status: false,
      message: "category_id required",
    });
  }
  try {
    const sub_category = await subcategory.findAll({
      where: { categoryId : req.query.category_id },
      include:[{
        model: category,
        as: "category",
      },
      {
        model:service,
        as:"service"
      }]
    });
    if (!sub_category) {
      return res.status(400).json({
        status: false,
        message: "category not found",
      });
    }
    return res.status(200).json({
      status: true,
      data: sub_category,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// update sub category api
const updateSubCategory = async (req, res) => {
  const { subcategoryName, description, color, status,type_of_subcategory } = req.body;
  if (!req.params.id) {
    return res.json({
      status: false,
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
        status: false,
        message: "id wrong",
      });
    }

    if (req.file) {
      const sub_category = await subcategory.update(
        {
          subcategoryName,
          status,
          description,
          color,
          type_of_subcategory,
          subcategory_img: filePath,
        },
        { where: { id: req.params.id } }
      );
      if (sub_category) {
        return res.status(200).json({
          status: true,
          message: "subcategory update successfully",
        });
      }
    } else {
      const sub_category = await subcategory.update(
        {
          subcategoryName,
          status,
          description,
          color,
          type_of_subcategory
        },
        { where: { id: req.params.id } }
      );
      if (sub_category) {
        return res.status(200).json({
          status: true,
          message: "subcategory update successfully",
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
// delete Subcategory 
const deleteSubCategory = async (req, res) => {
    if (!req.params.id) {
      return res.json({
        status: false,
        message: "subcategory id required",
      });
    }
    try {
      const sub_category = await subcategory.destroy({
        where: { id: req.params.id },
      });
  
      if (sub_category > 0) {
        return res.json({
          status: true,
          message: "Subcategory deleted successfully",
        });
      } else {
        return res.json({
          status: false,
          message: "Subcategory not found or delete operation failed",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  };
module.exports = {
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  getSubCategoryById,
  deleteSubCategory,
  getSubCategoryBy_categoryId,
  get_all_SubCategory
};
