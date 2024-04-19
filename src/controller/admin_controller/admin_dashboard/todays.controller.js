const db = require("../../../../config/db.config");
const User = db.User;
const chat = db.chat;
const call = db.call_details;
const booking = db.booking_detail;
const service = db.service;
const video = db.video;
const expert_service = db.expert_service
const { Op, Sequelize } = require("sequelize");
const { QueryTypes } = require('sequelize')
const moment = require("moment");

// exports.todaysUserCount = async (req, res) => {
//   try {
//       const user_type = "1";
//       const startOfToday = new Date();
//       startOfToday.setHours(0, 0, 0, 0); // Start of today
//       const endOfToday = new Date();
//       endOfToday.setHours(23, 59, 59, 999); // End of today

//       const countUsers = await User.findAndCountAll({
//           where: {
//               createdAt: {
//                   [Sequelize.Op.gte]: startOfToday, // Greater than or equal to start of today
//                   [Sequelize.Op.lte]: endOfToday, // Less than or equal to end of today
//               },
//               user_type: user_type,
//           },
//           order: [['id', 'DESC']]
//       });

//       if (countUsers.count > 0) {
//           return res.status(200).json({
//               status: true,
//               message: "Show Data and Count all data",
//               // data: countUsers.rows, // Assuming you want to return the users themselves
//               count: countUsers.count // The total count
//           });
//       } else {
//           return res.status(400).json({
//               status: false,
//               message: "Data not found",
//           });
//       }
//   } catch (error) {
//       console.error("Error:", error);
//       return res.status(500).json({
//           status: false,
//           message: error.message,
//       });
//   }
// };


// exports.todaysExpertCount = async (req, res) => {
//   try {
//       const user_types = ["2", "3"]; // Array of user types to filter on
//       const startOfToday = new Date();
//       startOfToday.setHours(0, 0, 0, 0); // Start of today
//       const endOfToday = new Date();
//       endOfToday.setHours(23, 59, 59, 999); // End of today

//       const countUsers = await User.findAndCountAll({
//           where: {
//               createdAt: {
//                   [Sequelize.Op.gte]: startOfToday, // Greater than or equal to start of today
//                   [Sequelize.Op.lte]: endOfToday, // Less than or equal to end of today
//               },
//               user_type: {
//                   [Sequelize.Op.in]: user_types, // Matches any user_type in the user_types array
//               },
//           },
//           order: [['id', 'DESC']]
//       });

//       if (countUsers.count > 0) {
//           return res.status(200).json({
//               status: true,
//               message: "Show Data and Count all data",
//               //data: countUsers.rows, // Assuming you want to return the users themselves
//               count: countUsers.count // The total count
//           });
//       } else {
//           return res.status(400).json({
//               status: false,
//               message: "Data not found",
//           });
//       }
//   } catch (error) {
//       console.error("Error:", error);
//       return res.status(500).json({
//           status: false,
//           message: error.message,
//       });
//   }
// };



// // API for today chat count
// exports.count_chat_for_today = async (req, res) => {
//   const startOfToday = new Date();
//   startOfToday.setHours(0, 0, 0, 0);

//   try {
//       const results = await chat.findAll({
//           attributes: [
//               'from_user_id',
//               'to_user_id',
//               [Sequelize.fn('COUNT', Sequelize.col('id')), 'chat_count']
//           ],
//           where: {
//               createdAt: {
//                   [Sequelize.Op.gte]: startOfToday,
//               }
//           },
//           group: ['from_user_id', 'to_user_id']
//       });

//       if (results.length > 0) {
//           const chats = new Set();
          
//           results.forEach(row => {
//               const { from_user_id, to_user_id } = row;
//               const chatPairId = [from_user_id, to_user_id].sort().join(':'); // Ensures a unique ID for each chat pair regardless of who initiated
//               chats.add(chatPairId);
//           });

//           // Now, 'chats' contains unique IDs for each chat pair that happened today
//           return res.send({
//               status: true,
//               message: "Get Data Successfully",
//               unique_chat_pairs_count: chats.size // Number of unique chat pairs
//           });
//       } else {
//           return res.send({
//               status: true,
//               message: "No chats found for today",
//               unique_chat_pairs_count: 0
//           });
//       }
//   } catch (error) {
//       console.error("Error:", error);
//       return res.status(500).send({
//           status: false,
//           message: "Internal Server Error",
//       });
//   }
// };

// // API for today call count
// exports.count_call_for_today = async (req, res) => {
  
//   const startOfToday = new Date();
//   startOfToday.setHours(0, 0, 0, 0);

//   try {
//     const results = await call.findAll({
//       attributes: [
//         'from_number',
//         'to_number', 
//         [Sequelize.fn('COUNT', Sequelize.col('id')), 'call_count']
//       ],
//       where: {
//         createdAt: {
//           [Sequelize.Op.gte]: startOfToday,
//         }
//       },
//       group: ['from_number', 'to_number']
//     });

//     // Assuming results is now an array of objects where each object represents a unique chat pair
//     // and their chat count for the last day.
//     if (results.length > 0) {
//       const chats = new Set();
          
//           results.forEach(row => {
//               const { from_number, to_number } = row;
//               const chatPairId = [from_number, to_number].sort().join(':'); // Ensures a unique ID for each chat pair regardless of who initiated
//               chats.add(chatPairId);
//           });

//           // Now, 'chats' contains unique IDs for each chat pair that happened today
//           return res.send({
//               status: true,
//               message: "Get Data Successfully",
//               unique_chat_pairs_count: chats.size // Number of unique chat pairs
//           });
//       } else {
//           return res.send({
//               status: true,
//               message: "No calls found for today",
//               unique_chat_pairs_count: 0
//           });
//       }
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).send({
//       status: false,
//       message: "Internal Server Error",
//     });
//   }
// }

// exports.count_video_call_for_today = async (req, res) => {
  
//   const startOfToday = new Date();
//   startOfToday.setHours(0, 0, 0, 0);

//   try {
//     const results = await videos.findAll({
//       attributes: [
//         'UserId',
//         'expert_id', 
//         [Sequelize.fn('COUNT', Sequelize.col('id')), 'videos_count']
//       ],
//       where: {
//         createdAt: {
//           [Sequelize.Op.gte]: startOfToday,
//         }
//       },
//       group: ['UserId', 'expert_id']
//     });

//     // Assuming results is now an array of objects where each object represents a unique chat pair
//     // and their chat count for the last day.
//     if (results.length > 0) {
//       const video_call = new Set();
          
//           results.forEach(row => {
//               const { UserId, expert_id } = row;
//               const chatPairId = [UserId, expert_id].sort().join(':'); // Ensures a unique ID for each chat pair regardless of who initiated
//               video_call.add(chatPairId);
//           });

//           // Now, 'chats' contains unique IDs for each chat pair that happened today
//           return res.send({
//               status: true,
//               message: "Get Data Successfully",
//               unique_chat_pairs_count: video_call.size // Number of unique chat pairs
//           });
//       } else {
//           return res.send({
//               status: true,
//               message: "No calls found for today",
//               unique_chat_pairs_count: 0
//           });
//       }
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).send({
//       status: false,
//       message: "Internal Server Error",
//     });
//   }
// }

// // API for get today's booking 
// exports.todayBookingData = async (req, res) => {
//   try {
      
//       const startOfToday = new Date();
//       startOfToday.setHours(0, 0, 0, 0); // Start of today
//       const endOfToday = new Date();
//       endOfToday.setHours(23, 59, 59, 999); // End of today

//       const countUsers = await booking.findAll({
//           where: {
//               createdAt: {
//                   [Sequelize.Op.gte]: startOfToday, // Greater than or equal to start of today
//                   [Sequelize.Op.lte]: endOfToday, // Less than or equal to end of today
//               },
              
//           },
//           include: [
//             {
//               model: User,
//               as: "User",
//               where: { id: Sequelize.col('booking_detail.UserId') }
//             },
//             {
//               model: service,
//               as: "service",
//               include: [
//                 {
//                   model: User,
//                   as: "User",
//                   where: { id: Sequelize.col('service.UserId') } // Here, we specify the association between the User model and the service model using the UserId from the service object
//                 }
//               ]
//             }
//           ],
//           order: [['id', 'DESC']]
//       });
     
//       if (countUsers) {
//           return res.status(200).json({
//               status: true,
//               message: "Show data successfully...",
//               data: countUsers, // Assuming you want to return the users themselves
//               // count: countUsers.count // The total count
//           });
//       } else {
//           return res.status(400).json({
//               status: false,
//               message: "Data not found",
//           });
//       }
//   } catch (error) {
//       console.error("Error:", error);
//       return res.status(500).json({
//           status: false,
//           message: error.message,
//       });
//   }
// };

exports.count_chat_connections = async (req, res) => {
  const id = req.query.id;
  try {
    const results = await chat.findAll({
      attributes: ['from_user_id', 'to_user_id'],
      where: {
        [Sequelize.Op.or]: [
          { from_user_id: id },
          { to_user_id: id }
        ]
      },
      group: ['from_user_id', 'to_user_id']
    });

    if (results.length > 0) {
      const chats = {};
      results.forEach(row => {
        const { from_user_id, to_user_id } = row;
        addChat(from_user_id, to_user_id);
        addChat(to_user_id, from_user_id);
      });

      function countUniqueChats() {
        const uniqueChats = {};
        if (chats[id]) {
          chats[id].forEach(receiverId => {
            uniqueChats[receiverId] = (uniqueChats[receiverId] || new Set()).add(id);
          });
        }
        return uniqueChats;
      }

      function addChat(userId, counterpartId) {
        if (!chats[userId]) {
          chats[userId] = [];
        }
        if (!chats[userId].includes(counterpartId)) {
          chats[userId].push(counterpartId);
        }
      }

      const uniqueChatsCounts = countUniqueChats();

      return res.send({
        status: true,
        message: "Get Data Successfully",
        chat_count: Object.keys(uniqueChatsCounts).length
      });
    } else {
      return res.send({
        status: false,
        message: "Data is Not Available",
        chat_count: 0
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      status: false,
      message: "Internal Server Error"
    });
  }
}


// exports.aggregateCounts = async (req, res) => {

//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const offset = (page - 1) * limit;
//     const startOfToday = new Date();
//     startOfToday.setHours(0, 0, 0, 0);
//     const endOfToday = new Date();
//     endOfToday.setHours(23, 59, 59, 999);

//     const todaysUserCount = await User.findAndCountAll({
//       where: {
//         createdAt: {
//           [Sequelize.Op.gte]: startOfToday,
//           [Sequelize.Op.lte]: endOfToday
//         },
//         user_type: "1"
//       },
//       // order: [['id', 'DESC']]
//       limit: limit,
//       offset: offset,
//     });

//     // API for total user
//     const user_type = "1";
//     const total_user = await User.findAndCountAll({
//         where : {
//             user_type : user_type
//         }
//     })

// // API for total experts
// const user_type_for_Experts = ['2','3','4']
// const total_expert = await User.findAndCountAll({
//   where : {
//       user_type : user_type_for_Experts
//   }
// })

// // API for total chats
// const results = await chat.findAll({
//   attributes: ['from_user_id', 'to_user_id'],
//   group: ['from_user_id', 'to_user_id']
// });
// let uniqueChats
// if (results.length > 0) {
//   uniqueChats = new Set();
  
//   results.forEach(row => {
//       const { from_user_id, to_user_id } = row;
//       // Create a string or another structure that uniquely identifies the chat pair
//       // Here, we ensure the lower ID always comes first to avoid duplicates like (1,2) and (2,1)
//       const chatPair = [from_user_id, to_user_id].sort().join(':');
//       uniqueChats.add(chatPair);
//   });
// }

// const getTotal = await call.findAndCountAll()
// const getTotalVideo = await video.findAndCountAll()

//     const todaysExpertCount = await User.findAndCountAll({
//       where: {
//         createdAt: {
//           [Sequelize.Op.gte]: startOfToday,
//           [Sequelize.Op.lte]: endOfToday
//         },
//         user_type: { [Sequelize.Op.in]: ["2", "3"] }
//       },
//       // order: [['id', 'DESC']]
//     });

//     const todaysChatCount = await chat.findAndCountAll({
//       where: {
//         createdAt: {
//           [Sequelize.Op.gte]: startOfToday
//         }
//       },
//       attributes: [
//         [Sequelize.fn('COUNT', Sequelize.col('id')), 'chat_count']
//       ],
//       // group: ['from_user_id', 'to_user_id']
//     });

//     const todaysCallCount = await call.findAndCountAll({
//       where: {
//         createdAt: {
//           [Sequelize.Op.gte]: startOfToday
//         }
//       },
//       attributes: [
//         [Sequelize.fn('COUNT', Sequelize.col('id')), 'call_count']
//       ],
//       // group: ['from_number', 'to_number']
//     });

//     const todaysVideoCallCount = await video.findAndCountAll({
//       where: {
//         createdAt: {
//           [Sequelize.Op.gte]: startOfToday
//         }
//       },
//       attributes: [
//         [Sequelize.fn('COUNT', Sequelize.col('id')), 'video_call_count']
//       ],
//       // group: ['UserId', 'expert_id']
//     });


//     const todaysBookingCount = await booking.findAndCountAll({
//       where: {
//         createdAt: {
//           [Sequelize.Op.gte]: startOfToday,
//           [Sequelize.Op.lte]: endOfToday
//         }
//       },
//       include: [{
//         model: User,
//         as: 'User' ,
//         attributes: ['id','name','user_type','profile_image']
//     }]
//     });
//     const totalCount = await booking.count({});
//     const totalPages = Math.ceil(totalCount / limit);
    
//     return res.status(200).json({
//       status: true,
//       message: "Data retrieved successfully",
//       counts: {
//         todaysUserCount: todaysUserCount.count || 0,
//         allCustomerData: todaysUserCount,
//         todaysExpertCount: todaysExpertCount.count || 0,
//         todaysChatCount: todaysChatCount.count || 0,
//         todaysCallCount: todaysCallCount.count || 0,
//         todaysVideoCallCount: todaysVideoCallCount.count || 0,
//         todaysBookingCount: todaysBookingCount.count || 0,
//         todayBookingData : todaysBookingCount,
//         total_userCount: total_user.count || 0,
//         total_expert_count: total_expert.count || 0,
//         total_uniqueChats_count: uniqueChats.size || 0,
//         get_total_call_count: getTotal.count || 0,
//         getTotalVideo_count: getTotalVideo.count || 0,
//         currentPage: page,
//         totalPages: totalPages,
//       }
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Internal Server Error",
//       error: error.message
//     });
//   }
// };


exports.aggregateCounts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todaysUserCount = await User.findAndCountAll({
      where: {
        createdAt: {
          [Sequelize.Op.gte]: startOfToday,
          [Sequelize.Op.lte]: endOfToday
        },
        user_type: "1"
      },
      // order: [['id', 'DESC']]
      limit: limit,
      offset: offset,
    });

    // API for total user
    const user_type = "1";
    const total_user = await User.findAndCountAll({
        where : {
            user_type : user_type
        }
    })

// API for total experts
const user_type_for_Experts = ['2','3','4']
const total_expert = await User.findAndCountAll({
  where : {
      user_type : user_type_for_Experts
  }
})

// API for total chats
const results = await chat.findAll({
  attributes: ['from_user_id', 'to_user_id'],
  group: ['from_user_id', 'to_user_id']
});
let uniqueChats
if (results.length > 0) {
  uniqueChats = new Set();
  
  results.forEach(row => {
      const { from_user_id, to_user_id } = row;
      // Create a string or another structure that uniquely identifies the chat pair
      // Here, we ensure the lower ID always comes first to avoid duplicates like (1,2) and (2,1)
      const chatPair = [from_user_id, to_user_id].sort().join(':');
      uniqueChats.add(chatPair);
  });
}

const getTotal = await call.findAndCountAll()
const getTotalVideo = await video.findAndCountAll()

    const todaysExpertCount = await User.findAndCountAll({
      where: {
        createdAt: {
          [Sequelize.Op.gte]: startOfToday,
          [Sequelize.Op.lte]: endOfToday
        },
        user_type: { [Sequelize.Op.in]: ["2", "3"] }
      },
      // order: [['id', 'DESC']]
    });

    const todaysChatCount = await chat.findAndCountAll({
      where: {
        createdAt: {
          [Sequelize.Op.gte]: startOfToday
        }
      },
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'chat_count']
      ],
      // group: ['from_user_id', 'to_user_id']
    });

    const todaysCallCount = await call.findAndCountAll({
      where: {
        createdAt: {
          [Sequelize.Op.gte]: startOfToday
        }
      },
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'call_count']
      ],
      // group: ['from_number', 'to_number']
    });

    const todaysVideoCallCount = await video.findAndCountAll({
      where: {
        createdAt: {
          [Sequelize.Op.gte]: startOfToday
        }
      },
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'video_call_count']
      ],
      // group: ['UserId', 'expert_id']
    });

    let expert_Id
    let expert_data = []
    const todaysBookingCount = await booking.findAndCountAll({
            where: {
        createdAt: {
          [Sequelize.Op.gte]: startOfToday,
          [Sequelize.Op.lte]: endOfToday
        },
        
      },
      include: [
        {
          model: User,
          as: "User",
          attributes:['id','name','user_type',"profile_image"],
          where: { id: Sequelize.col('booking_detail.UserId') }
        },
        // {
        //   model: service,
        //   as: "service",
        //   include: [
        //     {
        //       model: User,
        //       as: "User",
        //       attributes:['id','name','user_type',"profile_image"],
        //       where: { id: Sequelize.col('service.UserId') }
        //     }
        //   ]
        // }
        {
          model: expert_service,
          as: "expert_service",
          include: [
            {
              model:service,
              as:"service"
            }, 
            {
                  model: User,
                  as: "User",
                  attributes: ['id', 'user_type', 'name', 'profile_image'],
              },
          ]
      },
      ],
    });

    // for(let i =0; i<todaysBookingCount.length; i++){
    //   console.log(todaysBookingCount.length)
    //   expert_Id = todaysBookingCount[i].expert_id;
    //   const  ex_data = await User.findByPk(expert_Id)
    //   console.log(ex_data)
    //   expert_data.push({data :todaysBookingCount[i], expert : ex_data})

    

    //   // final_data.push()
    // }
    // console.log(expert_Id)
    // console.log(expert_data)
    const totalCount = await booking.count({});
    const totalPages = Math.ceil(totalCount / limit);
    
    return res.status(200).json({
      status: true,
      message: "Data retrieved successfully",
      counts: {
        todaysUserCount: todaysUserCount.count || 0,
        allCustomerData: todaysUserCount,
        todaysExpertCount: todaysExpertCount.count || 0,
        todaysChatCount: todaysChatCount.count || 0,
        todaysCallCount: todaysCallCount.count || 0,
        todaysVideoCallCount: todaysVideoCallCount.count || 0,
        todaysBookingCount: todaysBookingCount.count || 0,
        todayBookingData : todaysBookingCount,
        total_userCount: total_user.count || 0,
        total_expert_count: total_expert.count || 0,
        total_uniqueChats_count: uniqueChats.size || 0,
        get_total_call_count: getTotal.count || 0,
        getTotalVideo_count: getTotalVideo.count || 0,
        currentPage: page,
        totalPages: totalPages,
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};