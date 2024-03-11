const db = require("../../../../config/db.config");
const User = db.User;
const chat = db.chat;
const call = db.call_details
const { Op, Sequelize } = require("sequelize");
const { QueryTypes } = require('sequelize')
const moment = require("moment");

exports.todaysUserCount = async (req, res) => {
  try {
      const user_type = "1";
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0); // Start of today
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999); // End of today

      const countUsers = await User.findAndCountAll({
          where: {
              createdAt: {
                  [Sequelize.Op.gte]: startOfToday, // Greater than or equal to start of today
                  [Sequelize.Op.lte]: endOfToday, // Less than or equal to end of today
              },
              user_type: user_type,
          },
          order: [['id', 'DESC']]
      });

      if (countUsers.count > 0) {
          return res.status(200).json({
              status: true,
              message: "Show Data and Count all data",
              // data: countUsers.rows, // Assuming you want to return the users themselves
              count: countUsers.count // The total count
          });
      } else {
          return res.status(400).json({
              status: false,
              message: "Data not found",
          });
      }
  } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
          status: false,
          message: error.message,
      });
  }
};


// exports.todaysExpertCount = async (req, res) => {
//   try {
//       const user_type = ["2","3"];
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
//               data: countUsers.rows, // Assuming you want to return the users themselves
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


exports.todaysExpertCount = async (req, res) => {
  try {
      const user_types = ["2", "3"]; // Array of user types to filter on
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0); // Start of today
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999); // End of today

      const countUsers = await User.findAndCountAll({
          where: {
              createdAt: {
                  [Sequelize.Op.gte]: startOfToday, // Greater than or equal to start of today
                  [Sequelize.Op.lte]: endOfToday, // Less than or equal to end of today
              },
              user_type: {
                  [Sequelize.Op.in]: user_types, // Matches any user_type in the user_types array
              },
          },
          order: [['id', 'DESC']]
      });

      if (countUsers.count > 0) {
          return res.status(200).json({
              status: true,
              message: "Show Data and Count all data",
              //data: countUsers.rows, // Assuming you want to return the users themselves
              count: countUsers.count // The total count
          });
      } else {
          return res.status(400).json({
              status: false,
              message: "Data not found",
          });
      }
  } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
          status: false,
          message: error.message,
      });
  }
};



// API for today chat count
exports.count_chat_for_today = async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  try {
      const results = await chat.findAll({
          attributes: [
              'from_user_id',
              'to_user_id',
              [Sequelize.fn('COUNT', Sequelize.col('id')), 'chat_count']
          ],
          where: {
              createdAt: {
                  [Sequelize.Op.gte]: startOfToday,
              }
          },
          group: ['from_user_id', 'to_user_id']
      });

      if (results.length > 0) {
          const chats = new Set();
          
          results.forEach(row => {
              const { from_user_id, to_user_id } = row;
              const chatPairId = [from_user_id, to_user_id].sort().join(':'); // Ensures a unique ID for each chat pair regardless of who initiated
              chats.add(chatPairId);
          });

          // Now, 'chats' contains unique IDs for each chat pair that happened today
          return res.send({
              status: true,
              message: "Get Data Successfully",
              unique_chat_pairs_count: chats.size // Number of unique chat pairs
          });
      } else {
          return res.send({
              status: true,
              message: "No chats found for today",
              unique_chat_pairs_count: 0
          });
      }
  } catch (error) {
      console.error("Error:", error);
      return res.status(500).send({
          status: false,
          message: "Internal Server Error",
      });
  }
};


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

// API for today call count
exports.count_call_for_today = async (req, res) => {
  
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  try {
    const results = await call.findAll({
      attributes: [
        'from_number',
        'to_number', 
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'call_count']
      ],
      where: {
        createdAt: {
          [Sequelize.Op.gte]: startOfToday,
        }
      },
      group: ['from_number', 'to_number']
    });

    // Assuming results is now an array of objects where each object represents a unique chat pair
    // and their chat count for the last day.
    if (results.length > 0) {
      const chats = new Set();
          
          results.forEach(row => {
              const { from_number, to_number } = row;
              const chatPairId = [from_number, to_number].sort().join(':'); // Ensures a unique ID for each chat pair regardless of who initiated
              chats.add(chatPairId);
          });

          // Now, 'chats' contains unique IDs for each chat pair that happened today
          return res.send({
              status: true,
              message: "Get Data Successfully",
              unique_chat_pairs_count: chats.size // Number of unique chat pairs
          });
      } else {
          return res.send({
              status: true,
              message: "No calls found for today",
              unique_chat_pairs_count: 0
          });
      }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
}