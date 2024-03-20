// controllers/astrologerController.js

const db = require("../../../config/db.config");

const User = db.User;
const {Sequelize,Op,like } = require("sequelize")

exports.expert_list = async (req, res) => {
  try {
    const {user_type} = req.body;

  const page = Number(req.body.page) || 1;
  const limit = Number(req.body.limit) || 5;
  const offset = Number(req.body.offset) || 0;
   

    // Fetch users directly without counting
    const users = await User.findAll({
      where: {
        user_type: user_type,
        // user_status: "1",
        // chat_active: 1,
        // call_active: 1,
      },
      limit: limit,
      offset: offset,
    });

    const totalCount = await User.count({});
    const totalPages = Math.ceil(totalCount / limit)

    if (users.length > 0) { // Ensure we got results for the specified user types
      return res.status(200).json({
        status: true,
        message: "Showing Data of expert list",
        list: users,
        currentPage: page,
        totalPages,
      });
    } else {
      return res.status(400).json({
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


// exports.searchUser = async (req, res) => {
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
//     query.where.location = { [Sequelize.Op.like]: `%${location}%` };
//   }
//   if (language) {
//     query.where.language = { [Sequelize.Op.like]: `%${language}%` };
//   }
//   if (experience) {
//     query.where.experience = { [Sequelize.Op.like]: `%${experience}%` };
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
//       message: "Search Data successfully",
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