const Sequelize = require("sequelize");
const db = require("../../../config/db.config")
const TransactionHistory = db.transaction_history;
const User = db.User;
const wallet_system = db.wallet_system;




// exports.get_earning_by_userType = async (req, res) => {
//   try {
//     const { user_type } = req.query;
//     const page = parseInt(req.query.page) || 1; // Current page
//     const limit = parseInt(req.query.limit) || 10; // Number of items per page

//     // Calculate offset for pagination
//     const offset = (page - 1) * limit;

//     const findUser = await TransactionHistory.findAndCountAll({
//       where: {
//         user_type: user_type
//       },
//       include: [
//         {
//           model: User,
//           as: "User",
//           attributes: ['id', 'user_type', 'name', 'profile_image']
//         },
//         // {
//         //   model:wallet_system,
//         //   as:"wallet_system",
//         //   attributes:['id','wallet_amount']
//         // }
//       ],
//       limit: limit,
//       offset: offset
//     });

//     const totalItems = findUser.count;
//     const totalPages = Math.ceil(totalItems / limit);

//     if (findUser.rows.length > 0) {
//       return res.status(200).json({
//         status: true,
//         message: "Data retrieved successfully",
//         data: findUser.rows,
//         currentPage: page,
//         totalPages: totalPages,
//         totalItems: totalItems
//       });
//     } else {
//       return res.status(404).json({
//         status: false,
//         message: "Data not found"
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message
//     });
//   }
// };

exports.get_earning_by_userType = async (req, res) => {
  try {
    const { user_type } = req.query;
    const page = parseInt(req.query.page) || 1; // Current page
    const limit = parseInt(req.query.limit) || 10; // Number of items per page

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    const findUser = await TransactionHistory.findAndCountAll({
      where: {
        user_type: user_type
      },
      include: [
        {
          model: User,
          as: "User",
          attributes: ['id', 'user_type', 'name', 'profile_image']
        }
      ],
      limit: limit,
      offset: offset
    });

    // Calculate total earnings for admin, lawyer, and CA
    const totalAdminEarnings = await TransactionHistory.sum('transaction_amount', {
      where: {
        user_type: '0'
      }
    });

    const totalLawyerEarnings = await TransactionHistory.sum('transaction_amount', {
      where: {
        user_type: '4'
      }
    });

    const totalCAEarnings = await TransactionHistory.sum('transaction_amount', {
      where: {
        user_type: '2'
      }
    });

    const totalItems = findUser.count;
    const totalPages = Math.ceil(totalItems / limit);

    if (findUser.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Data retrieved successfully",
        data: findUser,
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        totalAdminEarnings: totalAdminEarnings,
        totalLawyerEarnings: totalLawyerEarnings,
        totalCAEarnings: totalCAEarnings
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "Data not found"
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};
