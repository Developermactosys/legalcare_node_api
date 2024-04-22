const {Sequelize} = require("sequelize");
const db = require("../../../config/db.config")
const TransactionHistory = db.transaction_history;
const User = db.User;
const wallet_system = db.wallet_system;
const Booking_details = db.booking_detail




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
          where : { id : getEarning[i].expert_id,
          user_type:getEarning[i].user_type
          },
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
        UserId: 9,
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
        UserId: 9
      }
    });
   
 // Calculate sum of all earnings (transaction_amount) for Audio calls
 const sum_of_audio_callearning = await TransactionHistory.sum('transaction_amount', {
  where: {
    deduct_type: "audio_call",
    UserId: 9
  }
});
    
  // Format admin_total_audio_call_earning to two decimal places
  const formatted_audio_earning = parseFloat(sum_of_audio_callearning.toFixed(2));
  const formatted_video_earning = parseFloat(sum_of_video_callearning.toFixed(2));

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
      admin_total_video_call_earning : formatted_video_earning,
      admin_total_audio_call_earning : formatted_audio_earning
      
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.get_earning_by_expert_id = async (req, res) => {
  try {
   const { expert_id } = req.query
const admin_id = 9
     // Calculate sum of all earnings (transaction_amount) for expert
     const sum_of_expert_earning = await TransactionHistory.sum('transaction_amount', {
      where: {
        deduct_type: "Booking",
        amount_receiver_id: expert_id
      }
    });
   
    // Calculate sum of all earnings (transaction_amount) for Admin
    const sum_of_admin_earning = await TransactionHistory.sum('transaction_amount', {
  where: {
    deduct_type: "Booking",
    UserId: admin_id,
    expert_id : expert_id,
  }
});
    const total_earning = parseFloat(sum_of_expert_earning + sum_of_admin_earning )

    const booking_count = await Booking_details.findAndCountAll({
      where : {
        expert_id:expert_id,
         payment_status:"paid"
      }
    })

    const expert_name = await User.findByPk(expert_id)

    // if (!AdminEarning) {
    //   return res.status(200).json({
    //     status: false,
    //     message: "AdminEarning not found",
    //   });
    // }

 

    return res.status(200).json({
      status: true,
      message: "AdminEarning retrieved successfully",
      // data: AdminEarning,
      provider_name:expert_name.name,
      no_of_booking :booking_count,
      total_earning :total_earning,
      provider_earning : sum_of_expert_earning,
      admin_earning : sum_of_admin_earning

      
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};



// exports.get_earning_List_for_admin = async (req, res) => {
//   try {
//     // const page = Number(req.query.page) || 1;
//     // const limit = Number(req.query.limit) || 10;
//     // const offset = (page - 1) * limit;
//     const allData = []
   
//     // const getEarning = await TransactionHistory.findAll({
//     // order: [["id", "DESC"]],
//     // limit: limit,
//     // offset: offset,
//     // })
//     // const totalCount = await TransactionHistory.count({});
//     // const totalPages = Math.ceil(totalCount / limit);

    
//     const user_type_for_Experts = ['2','3','4']

// const find_expert = await User.findAll({
//   where : { 
//     user_type:user_type_for_Experts, 
//     // user_type: { [Sequelize.Op.in]: ["2", "3" , "4"] },
//     is_verify: true
//     },

// })
//        for(let i=0; i<find_expert.length; i++){
//         const find_expert_booking_count = await Booking_details.count({
//           where : { expert_id : find_expert[i].id,
//             payment_status:"paid"
//           },
//         })

//         // const find_expert_wallet = await wallet_system.findAll({
//         //   where : { UserId : find_expert[i].id, }
//         // })
//         // const  find_expert_wallet_amount = find_expert_wallet[i].wallet_amount

//         const expert_name = find_expert[i].name
      
//         const find_transation_for_expert = await TransactionHistory.sum('transaction_amount', {
//         where : {  
//            UserId : find_expert[i].id,
//            deduct_type : "Booking"
//           } 
//         })

//         const find_transation_for_admin = await TransactionHistory.sum('transaction_amount', {
//           where : {  
//              UserId : 6 , 
//              expert_id : find_expert[i].id,
//              deduct_type : "Booking"
//             } 
//           })
        
// allData.push({expert_total_booking:find_expert_booking_count,
//             expert_name:expert_name,
//             // expert_wallet_amount:find_expert_wallet_amount,
//             expert_total_booking_earning:find_transation_for_expert,
//             admin_total_booking_earning:find_transation_for_admin}
//           )
//        }  

//         return res.status(200).json({
//             status : true,
//             // count:totalCount,
//             message : " Get All Expert_earning",
//             data :allData,

//             // // experts:allData,
//             // totalEarning_of_Expert:totalTransactionAmount,
//             // currentPage: page,
//             // totalPages: totalPages,
//         })
//     }
//  catch (error) {
//     return res.status(500).json({
//         status : false,
//         message : error.message
//     })
// }
// }

exports.get_earning_List_for_admin = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const allData = [];

    const user_type_for_Experts = ['2', '3', '4'];

    const find_expert = await User.findAll({
      where: {
        user_type: user_type_for_Experts,
        is_verify: true
      },
      offset: offset,  // Apply offset for pagination
      limit: limit     // Apply limit for pagination
    });

    for (let i = 0; i < find_expert.length; i++) {
      const find_expert_booking_count = await Booking_details.count({
        where: {
          expert_id: find_expert[i].id,
          payment_status: "paid"
        }
      });

      const expert_name = find_expert[i].name;
      const exp_id = find_expert[i].id
      const find_transation_for_expert = await TransactionHistory.sum('transaction_amount', {
        where: {
          UserId: find_expert[i].id,
          deduct_type: "Booking"
        }
      });

      const find_transation_for_admin = await TransactionHistory.sum('transaction_amount', {
        where: {
          UserId: 9,
          expert_id: find_expert[i].id,
          deduct_type: "Booking"
        }
      });

 // Format No of digits to two decimal places
 const formatted_expert_booking = parseFloat(find_expert_booking_count.toFixed(2));
 const formatted_transaction_for_expert = parseFloat(find_transation_for_expert.toFixed(2));
 const formatted_transaction_for_admin = parseFloat(find_transation_for_admin.toFixed(2));



      allData.push({
        id:exp_id,
        expert_total_booking: formatted_expert_booking,
        expert_name: expert_name,
        expert_total_booking_earning: formatted_transaction_for_expert,
        admin_total_booking_earning: formatted_transaction_for_admin
      });
    }

    const totalCount = await User.count({
      where: {
        user_type: user_type_for_Experts,
        is_verify: true
      }
    });
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      status: true,
      message: "Get All Expert Earnings",
      data: allData,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};


//  exports.get_earning_by_expertType = async (req, res) => {
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


// exports.get_earning_by_expert_id = async (req, res) => {
//   try {
//    const { expert_id } = req.query
//    const user_type = ['2','4','3']
//    const find_expert = await User.findAll({
//     where:{user_type:user_type}
//    })

//   //  console.log(find_expert)

// const admin_id = 9
//      // Calculate sum of all earnings (transaction_amount) for expert
//      const sum_of_expert_earning = await TransactionHistory.sum('transaction_amount', {
//       where: {
//         deduct_type: "booking",
//         amount_receiver_id: expert_id
//       }
//     });
   
//     // Calculate sum of all earnings (transaction_amount) for Admin
//     const sum_of_admin_earning = await TransactionHistory.sum('transaction_amount', {
//   where: {
//     deduct_type: "booking",
//     UserId: admin_id,
//     expert_id : expert_id,


//   }
// });
//     const total_earning = parseFloat(sum_of_expert_earning + sum_of_admin_earning )

//     const booking_count = await Booking_details.findAndCountAll({
//       where : {
//         expert_id:expert_id,
//          payment_status:null
//       }
//     })

//     const expert_name = await User.findByPk(expert_id)

//     // if (!AdminEarning) {
//     //   return res.status(200).json({
//     //     status: false,
//     //     message: "AdminEarning not found",
//     //   });
//     // }

 

//     return res.status(200).json({
//       status: true,
//       message: "AdminEarning retrieved successfully",
//       // data: AdminEarning,
//       provider_name:expert_name.name,
//       no_of_booking :booking_count,
//       total_earning :total_earning,
//       provider_earning : sum_of_expert_earning,
//       admin_earning : sum_of_admin_earning

      
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };