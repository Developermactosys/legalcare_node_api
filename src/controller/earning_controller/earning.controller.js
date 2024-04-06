const Sequelize = require("sequelize");
const db = require("../../../config/db.config")
const TransactionHistory = db.transaction_history;
const User = db.User;
const wallet_system = db.wallet_system;




exports.get_earning_by_userType = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const {expert_type} = req.query;
    let query = {
        where: {},
      };
    
      if (expert_type) {
        query.where.expert_type = { [Sequelize.Op.like]: `%${expert_type}%` };
      }

    const getEarning = await TransactionHistory.findAll({
        // where: { type_of_service: req.query.type_of_service },
        where: query.where,
        include:[
        {
            model:User,
            as:"User",
            attributes:['id','user_type','name','profile_image']
        }
    ],
    order: [["id", "DESC"]],
    limit: limit,
    offset: offset,
    })
    const totalCount = await services.count({});
    const totalPages = Math.ceil(totalCount / limit);


    if(getEarning){
        return res.status(200).json({
            status : true,
            count:totalCount,
            message : " get all services",
            data : getEarning,
            currentPage: page,
            totalPages: totalPages,
        })
    }else{
        return res.status(400).json({
            status : false,
            message : "Earning not found"
        })
    }
} catch (error) {
    return res.status(500).json({
        status : false,
        message : error.message
    })
}
}


// exports.get_earning_by_expertType = async (req, res) => {
//   try {
//     const { expert_type} = req.query;
//     const page = parseInt(req.query.page) || 1; // Current page
//     const limit = parseInt(req.query.limit) || 10; // Number of items per page

//     // Calculate offset for pagination
//     const offset = (page - 1) * limit;

//     // const findUser = await TransactionHistory.findAndCountAll({
//     //   where: {
//     //     user_type: user_type
//     //   },
//     //   include: [
//     //     {
//     //       model: User,
//     //       as: "User",
//     //       attributes: ['id', 'user_type', 'name', 'profile_image']
//     //     }
//     //   ],
//     //   limit: limit,
//     //   offset: offset
//     // });

//     // Calculate total earnings for admin, lawyer, and CA
//     // const totalAdminEarnings = await wallet_system.findOne({
//     //   where: {
//     //     UserId: 9
//     //   }
//     // });
//     // const AdminEarnings = totalAdminEarnings.wallet_amount

//     // const totalLawyerEarnings = await wallet_system.findOne({
//     //   where: {
//     //     UserId: 77
//     //   }
//     // });
//     // const LawyerEarnings = totalLawyerEarnings.wallet_amount

//     const totalCAEarnings = await wallet_system.findOne({
//       where: {
//         user_type: expert_type
//       },
//       include: [
//             {
//               model: User,
//               as: "User",
//               attributes: ['id', 'user_type', 'name', 'profile_image']
//             }
//           ],
//     });

// const findCa = totalCAEarnings.UserId
// const ca_exist = await User.findByPk(findCa,{

// where : {user_type:'2'}

// })
// console.log(ca_exist);
//     // const totalItems = findUser.count;
//     // const totalPages = Math.ceil(totalItems / limit);

//     // if (findUser.rows.length > 0) {
//       return res.status(200).json({
//         status: true,
//         message: "Data retrieved successfully",
//         // data: findUser,
//         currentPage: page,
     
//         // totalPages: totalPages,
//         // totalItems: totalItems,
//         // totalAdminEarnings: AdminEarnings || 0,
//         // totalLawyerEarnings: LawyerEarnings || 0,
//         totalCAEarnings
//       });
//     // } else {
//     //   return res.status(200).json({
//     //     status: false,
//     //     message: "Data not found"
//     //   });
//     // }
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message
//     });
//   }
// };

// exports.get_earning_by_expertType = async(req, res) =>{
//   try {
//       const page = Number(req.query.page) || 1;
//       const limit = Number(req.query.limit) || 10;
//       const offset = (page - 1) * limit;
//       const {expert_type} = req.query;
//       let query = {
//           where: {},
//         };
      
//         if (expert_type) {
//           query.where.expert_type = { [Sequelize.Op.like]: `%${expert_type}%` };
//         }

//       const getEarning = await TransactionHistory.findAll({
//           // where: { type_of_service: req.query.type_of_service },
//           where: query.where,
//           include:[
//           {
//               model:User,
//               as:"User",
//               attributes:['id','user_type','name','profile_image']
//           }
//       ],
//       order: [["id", "DESC"]],
//       limit: limit,
//       offset: offset,
//       })
//       const totalCount = await services.count({});
//       const totalPages = Math.ceil(totalCount / limit);


//       if(getEarning){
//           return res.status(200).json({
//               status : true,
//               count:totalCount,
//               message : " get all services",
//               data : getEarning,
//               currentPage: page,
//               totalPages: totalPages,
//           })
//       }else{
//           return res.status(400).json({
//               status : false,
//               message : "Earning not found"
//           })
//       }
//   } catch (error) {
//       return res.status(500).json({
//           status : false,
//           message : error.message
//       })
//   }
// }
