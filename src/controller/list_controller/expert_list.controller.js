// controllers/astrologerController.js

const db = require("../../../config/db.config");

const User = db.User;
const {Sequelize,Op,like, where } = require("sequelize")

exports.expert_list = async (req, res) => {
  
  try {
  
  const {user_type, type_account, work_type, location,language, experience,category_of_lawyer,
    type_of_lawyer,case_type,max_per_minute, min_per_minute, address,is_verify } = req.query;
  
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    let query = {
      where: { 
      },
    };
    if (is_verify) {
      query.where.is_verify = { [Sequelize.Op.like]: `%${is_verify}%` }; // Direct match
    }
    // Add the order clause for random order

    if (user_type) {
      query.where.user_type = { [Sequelize.Op.like]: `%${user_type}%` };
    }
    if (type_account) {
      query.where.type_account = { [Sequelize.Op.like]: `%${type_account}%` };
    }
    if (work_type) {
      query.where.work_type = { [Sequelize.Op.like]: `%${work_type}%` };
    }
    if (location) {
      query.where.location = { [Sequelize.Op.like]: `%${location}%` };
    }
    if (address) {
      query.where.address = { [Sequelize.Op.like]: `%${address}%` };
    }
    if (language) {
      query.where.user_language = { [Sequelize.Op.like]: `%${language}%` };
    }
    if (experience) {
      query.where.user_experience = { [Sequelize.Op.like]: `%${experience}%` };
    }
    if (category_of_lawyer) {
      query.where.category_of_lawyer = { [Sequelize.Op.like]: `%${category_of_lawyer}%` };
    }
    if (type_of_lawyer) {
      query.where.type_of_lawyer = { [Sequelize.Op.like]: `%${type_of_lawyer}%` };
    }
    if (case_type) {
      query.where.case_type = { [Sequelize.Op.like]: `%${case_type}%` };
    }
    if (min_per_minute && max_per_minute) {
      query.where.per_minute = {
        [Sequelize.Op.between]: [min_per_minute, max_per_minute],
      };
    } else if (min_per_minute) {
      query.where.per_minute = { [Sequelize.Op.gte]: min_per_minute };
    } else if (max_per_minute) {
      query.where.per_minute = { [Sequelize.Op.lte]: max_per_minute };
    }

    query.order = Sequelize.literal('RAND()'); // For MySQL
    // For PostgreSQL, use: query.order = Sequelize.literal('RANDOM()');

    // Fetch users directly without counting
    const users = await User.findAll(query,{
      where: {
        user_type: user_type,
        is_verify:true,
        // user_status: "1",
        // chat_active: 1,
        // call_active: 1,
      },
      order: query.order,
      limit: limit,
      offset: offset,
    });
    const totalCount = users.length
    const totalPages = Math.ceil(totalCount / limit)

    if (users.length > 0) { // Ensure we got results for the specified user types
      return res.status(200).json({
        status: true,
        message: "Showing Data of expert list",
        list: users,
        currentPage: page,
        totalPages : totalPages,
        count : users.length
      });
    } else {
      return res.status(200).json({
        status: false,
        message: `Data not found for user_type ${user_type}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


// exports.expertFilter = async (req, res) => {
//   const {user_type, type_account, work_type, location,language, experience,category_of_lawyer,
//   type_of_lawyer,case_type, } = req.query;

//   let query = {
//     where: {},
//   };
//   // if (id) {
//   //   query.where.id = id; // Direct match
//   // }
//   if (user_type) {
//     query.where.user_type = { [Sequelize.Op.like]: `%${user_type}%` };
//   }
//   if (type_account) {
//     query.where.type_account = { [Sequelize.Op.like]: `%${type_account}%` };
//   }
//   if (work_type) {
//     query.where.work_type = { [Sequelize.Op.like]: `%${work_type}%` };
//   }
//   if (location) {
//     query.where.address = { [Sequelize.Op.like]: `%${location}%` };
//   }
//   if (language) {
//     query.where.user_language = { [Sequelize.Op.like]: `%${language}%` };
//   }
//   if (experience) {
//     query.where.user_experience = { [Sequelize.Op.like]: `%${experience}%` };
//   }
//   if (category_of_lawyer) {
//     query.where.category_of_lawyer = { [Sequelize.Op.like]: `%${category_of_lawyer}%` };
//   }
//   if (type_of_lawyer) {
//     query.where.type_of_lawyer = { [Sequelize.Op.like]: `%${type_of_lawyer}%` };
//   }
//   if (case_type) {
//     query.where.case_type = { [Sequelize.Op.like]: `%${case_type}%` };
//   }
//   // if (createdAt) {
//   //   query.where.createdAt = Sequelize.where(
//   //     Sequelize.fn("date", Sequelize.col("createdAt")),
//   //     "=",
//   //     createdAt
//   //   ); // Assumes createdAt is in 'YYYY-MM-DD' format
//   // }

//   try {
//     const users = await User.findAll(query);
//     return res.status(200).json({
//       success: true,
//       message: "Fillter Data successfully",
//       data : users
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



