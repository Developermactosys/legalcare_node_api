const Sequelize = require("sequelize");
const db = require("../../../config/db.config")
const TransactionHistory = db.transaction_history;
const User = db.User;
const wallet_system = db.wallet_system;


// exports.get_earning_by_userType = async(req, res) =>{
//   try {
//     const { user_type } = req.query;
//     const findUser = await TransactionHistory.findAll({
//         where : {
//             user_type: user_type
//         },
//         include:[
//         {
//             model:User,
//             as:"User",
//             attributes:['id','user_type','name','profile_image']
//         }
//     ],
//       })
//     if(findUser){
//         return res.status(200).json({
//           status : true,
//           message : "get data successfully",
//           data:findUser
//         })
//     }else{
//       return res.status(404).json({
//         status : false,
//         message : "data not found "
//       })
//     }
//   } catch (error) {
//     return res.status(500).json({
//       status : false,
//       message : error.message
//     })
//   }
// }


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
        },
        // {
        //   model:wallet_system,
        //   as:"wallet_system",
        //   attributes:['id','wallet_amount']
        // }
      ],
      limit: limit,
      offset: offset
    });

    const totalItems = findUser.count;
    const totalPages = Math.ceil(totalItems / limit);

    if (findUser.rows.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Data retrieved successfully",
        data: findUser.rows,
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems
      });
    } else {
      return res.status(404).json({
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