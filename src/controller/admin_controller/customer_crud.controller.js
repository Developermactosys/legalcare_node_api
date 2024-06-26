
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>For Admin Section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
const { messaging } = require("firebase-admin");
const db = require("../../../config/db.config")
const User = db.User;
const {Sequelize,Op,or, where }= require("sequelize");
const wallet_system = db.wallet_system;
const chat = db.chat;
const call=db.call_details;
const video = db.video;
const document = db.document;
const bank_details = db.bank_details;
const TransactionHistory = db.transaction_history;
const booking_detail = db.booking_detail

// API for count total user
exports.totalUser = async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

      const user_type = "1";
      const countUsers = await User.findAndCountAll({
        where: {
          user_type: user_type,
        },
      limit: limit,
      offset: offset,
      });

      const totalCount = await User.count({where:{
        user_type: user_type,deleted_At:null
      }
    });
      const totalPages = Math.ceil(totalCount/ limit);

      if (countUsers) {
        return res.status(200).json({
          success: true,
          message: "Show Data and Count all data",
          // count:totalCount,
          data: countUsers,
          currentPages: page,
          totalPages:totalPages
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "Data not found",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  exports.getuserDetails = async (req, res) => {
    const { UserId } = req.params;
    try {
      const userDetails = await User.findByPk(UserId, {
        include: [{
          model: wallet_system,
          attributes: ["wallet_amount"],
          as: 'wallet_system', 
        },{
            model: chat,
            as: 'chat'
        },{
            model: call,
            as: 'call_details'
          
        },{
            model: video,
            as: 'video'
        },{
          model: document,
          as: 'document'
        }]
      });
      if (userDetails) {
        return res.status(200).json({
          success: true,
          message: "Get user details",
          data: userDetails,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "user Id not found ",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  // API for user delete from admin
exports.delUserDetails = async (req, res) => {
  const { UserId } = req.params;
  try {
    // Find the user by their primary key (UserId)
    const user = await User.findByPk(UserId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.user_type === "1") {
      const bookingData = await booking_detail.findAll({
        where: { UserId: UserId }
      });

      // Check if any booking has 'pending' status
      const hasPendingBooking = bookingData && bookingData.some(booking => booking.status === 'pending');

      if (hasPendingBooking) {
        return res.status(200).json({
          status: false,
          message: "Cannot delete User due to pending bookings"
        });
      }

      await db.booking_detail.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      await TransactionHistory.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      const wallet_balance_amount = await wallet_system.findOne({
        where: { UserId: UserId }
      });

      const wallet_balance = wallet_balance_amount ? wallet_balance_amount.wallet_amount : 0;

      if (wallet_balance < 0) {
        return res.status(200).json({
          status: false,
          message: "Your wallet balance is negative so we cannot delete your account"
        });
      }

      if (wallet_balance >= 0) {
        await wallet_system.destroy({
          where: {
            UserId: UserId,
          },
          force: true
        });
      }

      await bank_details.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      await db.call_details.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      await chat.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      await video.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      await db.withdrawal_request.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      await db.notification.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      await document.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      // Delete the user
      await user.destroy({
        force: true
      });

      return res.status(200).json({
        success: true,
        message: "Your account deleted successfully",
      });
    }

    if (user.user_type == "2" || user.user_type == "3" || user.user_type == "4") {
      const bookingData = await db.booking_detail.findAll({
        where: { expert_id: UserId }
      });

      // Check if any booking has 'pending' status
      const hasPendingBooking = bookingData && bookingData.some(booking => booking.status === 'pending');

      if (hasPendingBooking) {
        return res.status(200).json({
          status: false,
          message: "Cannot delete Expert due to pending bookings of User"
        });
      }

      await db.booking_detail.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      await TransactionHistory.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      const wallet_balance_amount = await wallet_system.findOne({
        where: { UserId: UserId }
      });

      const wallet_balance = wallet_balance_amount ? wallet_balance_amount.wallet_amount : 0;

      if (wallet_balance < 0) {
        return res.status(200).json({
          status: false,
          message: "Your wallet balance is negative so we cannot delete your account"
        });
      }

      if (wallet_balance >= 0) {
        await wallet_system.destroy({
          where: {
            UserId: UserId,
          },
          force: true
        });
      }

      await bank_details.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      await db.call_details.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      await chat.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      await video.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      await db.withdrawal_request.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      await db.notification.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      await document.destroy({
        where: {
          UserId: UserId,
        },
        force: true
      });

      // Delete the user
      await user.destroy({
        force: true
      });

      return res.status(200).json({
        success: true,
        message: "Your account deleted successfully",
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

  // API for search user form admin side.
  exports.searchUser = async (req, res) => {
    const { id, email, name,phone_no, createdAt } = req.query;
  
    let query = {
      where: {},
    };
  
    if (id) {
      query.where.id = id; // Direct match
    }
    if (email) {
      query.where.email = { [Sequelize.Op.like]: `%${email}%` };
    }
    if (name) {
      query.where.name = { [Sequelize.Op.like]: `%${name}%` };
    }
    if (phone_no) {
      query.where.phone_no = { [Sequelize.Op.like]: `%${phone_no}%` };
    }
    if (createdAt) {
      query.where.createdAt = Sequelize.where(
        Sequelize.fn("date", Sequelize.col("createdAt")),
        "=",
        createdAt
      ); // Assumes createdAt is in 'YYYY-MM-DD' format
    }
    try {
      const users = await User.findAll(query);
      return res.status(200).json({
        success: true,
        message: "Search Data successfully",
        data : users
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  // Count Total user
  exports.totalUserForCa = async (req, res) => {
    try {
      const userTypes = ["2", "3","4"];
  
      // Create a promise array to fetch counts for both user types concurrently
      const countsPromises = userTypes.map((type) =>
        User.findAndCountAll({
          where: { user_type: type },
          include: [
            {
              model: wallet_system,
              as: "wallet_system",
            },
            {
              model: chat,
              as: "chat",
            },
            {
              model: call,
              as: "call_details",
            },{
              model: video,
              as: "video",
            },
            {
              model: document,
              as: "document",
            },
            {
              model: bank_details,
              as: 'bank_details'
            },
          ],
        })
      );
  
      // Use Promise.all to execute all count queries concurrently for efficiency
      const counts = await Promise.all(countsPromises);
  
      // Calculate the total count by summing up the counts for both user types
      const totalCount = counts.reduce((acc, current) => acc + current.count, 0);
  
      if (counts.length === userTypes.length) {
        // Ensure we got results for both types
        return res.status(200).json({
          success: true,
          message: "Show Data and Count all data",
          data: {
            totalUserCount: totalCount, // total count for user types "2" and "3"
            data: counts,
          },
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Data not found",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  // For final api for customer CRUD 
exports.getAllCallDetailById = async(req, res) =>{
  try {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const findUser = await User.findByPk(id)
    if(findUser){
      const getCall = await call.findAndCountAll({
        // where : {
        //   UserId: id
        // }
        where: {
          [Sequelize.Op.or]: [
            {
              UserId: id,
            },
            {
              expert_id: id,
            },
          ],
        },
        limit: limit,
       offset: offset,
      })
      const totalCount = await call.count({
        where: {
          [Sequelize.Op.or]: [
            {
              UserId: id,
            },
            {
              expert_id: id,
            },
          ],
        }
       });
       const totalPages = Math.ceil(totalCount / limit);
      if(getCall){
        return res.status(200).json({
          status : true,
          message : "Showing Call detail's ",
          data: getCall,
          currentPage : page, 
          totalPages: totalPages
        })
      }else{
        return res.status(400).json({
          status : false,
          message : "call not found"
        })
      }
    }else{
      return res.status(404).json({
        status : false,
        message : "user not found "
      })
    }
  } catch (error) {
    return res.status(500).json({
      status : false,
      message : error.message
    })
  }
}

// API for get all video call Details by id
exports.getAllVideoCallDetailById = async(req, res) =>{
  try {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const findUser = await User.findByPk(id)
    if(findUser){
      const getCall = await video.findAndCountAll({
        // where : {
        //   UserId: id
        // }
        where: {
          [Sequelize.Op.or]: [
            {
              UserId: id,
            },
            {
              expert_id: id,
            },
          ],
        },
        limit: limit,
        offset: offset,
      })
      const totalCount = await video.count({
        where: {
          [Sequelize.Op.or]: [
            {
              UserId: id,
            },
            {
              expert_id: id,
            },
          ],
        }
       });
       const totalPages = Math.ceil(totalCount / limit);
      if(getCall){
        return res.status(200).json({
          status : true,
          message : "Showing Video Call detail's",
          data :getCall,
          currentPage : page, 
          totalPages: totalPages
        })
      }else{
        return res.status(400).json({
          status : false,
          message : "Video call not found"
        })
      }
    }else{
      return res.status(404).json({
        status : false,
        message : "user not found "
      })
    }
  } catch (error) {
    return res.status(500).json({
      status : false,
      message : error.message
    })
  }
}

// API for get all document details by id
exports.getAllDocumentDetailById = async(req, res) =>{
  try {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const findUser = await User.findByPk(id)
    if(findUser){
      const getCall = await document.findAll({
        where : {
          UserId: id
        },
        limit: limit,
        offset: offset,
      })

      const totalCount = await document.count({
        where : {
          UserId: id
        }
       });
      const totalPages = Math.ceil(totalCount / limit);
      if(getCall){
        return res.status(200).json({
          status : true,
          message : "Showing document's ",
          data:getCall,
          currentPage : page, 
          totalPages: totalPages
        })
      }else{
        return res.status(400).json({
          status : false,
          message : "document not found"
        })
      }
    }else{
      return res.status(404).json({
        status : false,
        message : "user not found "
      })
    }
  } catch (error) {
    return res.status(500).json({
      status : false,
      message : error.message
    })
  }
}

 //  function for search data
 const buildUserQuery = (queryParams) => {
  const { id, email, name, phone_no, createdAt } = queryParams;
  let query = {
    where: {},
  };

  if (id) {
    query.where.id = id; // Direct match
  }
  if (email) {
    query.where.email = { [Sequelize.Op.like]: `%${email}%` };
  }
  if (name) {
    query.where.name = { [Sequelize.Op.like]: `%${name}%` };
  }
  if (phone_no) {
    query.where.phone_no = { [Sequelize.Op.like]: `%${phone_no}%` };
  }
  if (createdAt) {
    query.where.createdAt = Sequelize.where(
      Sequelize.fn("date", Sequelize.col("createdAt")),
      "=",
      createdAt
    ); // Assumes createdAt is in 'YYYY-MM-DD' format
  }
  
  return query;
};

  // API for count for chat, video and call
exports.totalCountForCustomer = async(req, res)=>{
  const id = req.query.id;
    try {
      if (!id) {
        return res.status(200).json({
          status: false,
          message: "Please provide valid id",
        });
      }
      const find_user = await User.findOne({
        where: {
          id: id,
          deleted_At: null,
        },
      });
      if (!find_user) {
        return res.status(200).json({
          status: false,
          message: "User not exist",
        });
      }

      // Build query for chats, calls, and videos based on user details
      const userQuery = buildUserQuery(req.query);

      const results = await chat.findAll({
        attributes: ["from_user_id", "to_user_id"],
        where: {
          [Sequelize.Op.or]: [{ from_user_id: id }, { to_user_id: id }],
        },
        group: ["from_user_id", "to_user_id"],
      });
      // let uniqueChatsCounts;
      let uniqueChatsCounts = {}; // Initialize as an empty object
      if (results.length > 0) {
        const chats = {};
        results.forEach((row) => {
          const { from_user_id, to_user_id } = row;
          addChat(from_user_id, to_user_id);
          addChat(to_user_id, from_user_id);
        });

        function countUniqueChats() {
          const uniqueChats = {};
          if (chats[id]) {
            chats[id].forEach((receiverId) => {
              uniqueChats[receiverId] = (
                uniqueChats[receiverId] || new Set()
              ).add(id);
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

        uniqueChatsCounts = countUniqueChats();

        // return res.send({
        //   status: true,
        //   message: "Get Data Successfully",
        //   chat_count: Object.keys(uniqueChatsCounts).length,
        // });
      }
      const getCall = await video.findAndCountAll({
        // where : {
        //   UserId: id
        // }
        where: {
          [Sequelize.Op.or]: [
            {
              UserId: id,
            },
            {
              expert_id: id,
            },
          ],
        },
      });
      const dataForCall = await call.findAndCountAll({
        // where : {
        //   UserId: id
        // }
        where: {
          [Sequelize.Op.or]: [
            {
              UserId: id,
            },
            {
              expert_id: id,
            },
          ],
        },
      });

      // Calculate sum of all earnings (transaction_amount) for video calls
      const sum_of_video_callearning = await TransactionHistory.sum(
        "transaction_amount",
        {
          where: {
            deduct_type: "video_call",
            UserId: id,
          },
        }
      );

      // Calculate sum of all earnings (transaction_amount) for Audio calls
      const sum_of_audio_callearning = await TransactionHistory.sum(
        "transaction_amount",
        {
          where: {
            deduct_type: "audio_call",
            UserId: id,
          },
        }
      );

// Calculate sum of all earnings (transaction_amount) for Chats
const sum_of_chat_earning = await TransactionHistory.sum('transaction_amount', {
  where: {
  deduct_type: "chat",
  UserId: id
  }
  });

      return res.status(200).json({
        status: true,
        message:
          "Showing total_count for total_call ,total_video and total_chat",
        call: dataForCall.count || 0,
        video: getCall.count || 0,
        chat_count: Object.keys(uniqueChatsCounts).length || 0,
        Expert_total_video_callearning: sum_of_video_callearning,
        Expert_total_audio_callearning: sum_of_audio_callearning,
        Expert_total_chat_earning: sum_of_chat_earning || 0,
      });
    }catch(error){
        return res.status(500).json({
          status : false,
          message : error.message
        })
      }
}



