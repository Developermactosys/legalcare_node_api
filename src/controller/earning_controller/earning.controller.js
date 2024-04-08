const Sequelize = require("sequelize");
const db = require("../../../config/db.config")
const TransactionHistory = db.transaction_history;
const User = db.User;
const wallet_system = db.wallet_system;




// exports.get_earning_by_userType = async (req, res) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const offset = (page - 1) * limit;
//     const { user_type } = req.query;

//     let query = {
//       where: {},
//     };

//     if (user_type) {
//       query.where.user_type = { [Sequelize.Op.like]: `%${user_type}%` };
//     }

//     const getEarning = await TransactionHistory.findAll({
//       attributes: ['id', 'transaction_amount', 'user_type', 'expert_id'],
//       where: query.where,
//       include: [
//         {
//           model: User,
//           as: "User",
//           where: { id: Sequelize.col('transaction_history.expert_id') },
//           attributes: ['id', 'user_type', 'name', 'profile_image']
//         }
//       ],
//       order: [["id", "DESC"]],
//       limit: limit,
//       offset: offset,
//     });

//     const totalCount = await TransactionHistory.count({});
//     const totalPages = Math.ceil(totalCount / limit);

//     if (getEarning.length > 0) {
//       // Group transactions by expert_id
//       const expertsMap = new Map();
//       getEarning.forEach(earning => {
//         const { expert_id, User } = earning;
//         if (!expertsMap.has(expert_id)) {
//           expertsMap.set(expert_id, {
//             expert_id: expert_id,
//             expert_details: User,
//             total_transaction_amount: 0,
//             transactions: []
//           });
//         }
//         const expertEntry = expertsMap.get(expert_id);
//         expertEntry.total_transaction_amount += (earning.transaction_amount || 0);
//         expertEntry.transactions.push({
//           transaction_id: earning.id,
//           transaction_amount: earning.transaction_amount,
//           user_type: earning.user_type,
//           user_name: User.name,
//           user_profile_image: User.profile_image
//         });
//       });

//       const experts = Array.from(expertsMap.values());

//       return res.status(200).json({
//         status: true,
//         count: totalCount,
//         message: "Get all earnings",
//         experts: experts,
//         currentPage: page,
//         totalPages: totalPages,
//       });
//     } else {
//       return res.status(404).json({
//         status: false,
//         message: "No earnings found",
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };








exports.get_earning_by_userType = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const {user_type} = req.query;
    const allData = []
    let query = {
        where: {},
      };
    
      if (user_type) {
        query.where.user_type = { [Sequelize.Op.like]: `%${user_type}%` };
      }

    const getEarning = await TransactionHistory.findAll({

        attributes:['id','transaction_amount','user_type','expert_id','currents_date'],

        where: query.where,
    //     include:[
    //     {
    //         model:User,
    //         as:"User",
    //         attributes:['id','user_type','name','profile_image']
    //     }
    // ],
    order: [["id", "DESC"]],
    limit: limit,
    offset: offset,
    })
    const totalCount = await TransactionHistory.count({});
    const totalPages = Math.ceil(totalCount / limit);

    if(getEarning){

      // Calculate total transaction amount
      const totalTransactionAmount = getEarning.reduce((sum, earning) => {
        return sum + (earning.transaction_amount || 0); // Handle null/undefined transaction_amount values
      }, 0);

        //  // Extract unique experts from the result set
        //  const experts = Array.from(new Set(getEarning.map(earning => earning.User)));
       for(let i=0; i<getEarning.length; i++){
        const find_expert = await User.findAll({
          where : { id : getEarning[i].expert_id},
          attributes:['id','name',"user_type","profile_image"]
        })
        allData.push(find_expert)
       }  


        return res.status(200).json({
            status : true,
            count:totalCount,
            message : " Get All Expert_earning",
            data :{ earning :getEarning, experts :allData},
            // experts:allData,
            totalEarning_of_Expert:totalTransactionAmount,
            currentPage: page,
            totalPages: totalPages,
        })
    }else{
        return res.status(400).json({
            status : false,
            message : "Expert_earning not found"
        })
    }
} catch (error) {
    return res.status(500).json({
        status : false,
        message : error.message
    })
}
}


exports.getAdminEarning = async (req, res) => {
 
  try {
   
    const AdminEarning = await wallet_system.findOne({
      attributes:['id','wallet_amount','outstanding_amount','UserId'],
      where: {
        UserId: 6,
      }, 
          include:[
        {
            model:User,
            as:"User",
            attributes:['id','user_type','name','profile_image']
        }
    ],
    });


     // Calculate sum of all earnings (transaction_amount) for video calls
     const sum_of_video_callearning = await TransactionHistory.sum('transaction_amount', {
      where: {
        deduct_type: "video_call",
        UserId: 6
      }
    });
   
 // Calculate sum of all earnings (transaction_amount) for Audio calls
 const sum_of_audio_callearning = await TransactionHistory.sum('transaction_amount', {
  where: {
    deduct_type: "audio_call",
    UserId: 6
  }
});
    
    if (!AdminEarning) {
      return res.status(200).json({
        status: false,
        message: "AdminEarning not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "AdminEarning retrieved successfully",
      data: AdminEarning,
      admin_total_video_call_earning : sum_of_video_callearning,
      admin_total_audio_call_earning : sum_of_audio_callearning
      
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};






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
