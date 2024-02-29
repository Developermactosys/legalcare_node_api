const db = require("../../../../config/db.config");
const User = db.User;
const Chat = db.chat;
const { Op } = require("sequelize");
const moment = require("moment");

exports.todaysUserCount = async (req, res) => {
  try {
    const today = moment().startOf('day'); // Get start of today
    const tomorrow = moment(today).add(1, 'days'); // Get start of tomorrow
    const user_type = "1";

    const countUsers = await User.findAndCountAll({
      where: {
        createdAt: {
          [Op.between]: [today, tomorrow] // Filter users created between start of today and start of tomorrow
        },
        user_type: user_type,
      },
      order : [['id','DESC']]
    });

    if (countUsers) {
    //   console.log(countUsers);

      return res.status(200).json({
        status: true,
        message: "Show Data and Count all data",
        data: countUsers,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Data not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.todaysExpertCount = async (req, res) => {
    try {
      const today = moment().startOf('day'); // Get start of today
      const tomorrow = moment(today).add(1, 'days'); // Get start of tomorrow
      const user_type = "2";
  
      const countExpert = await User.findAndCountAll({
        where: {
          createdAt: {
            [Op.between]: [today, tomorrow] // Filter users created between start of today and start of tomorrow
          },
          user_type: user_type,
        },
        order : [['id','DESC']]
      });
  
      if (countExpert) {
      //   console.log(countExpert);
  
        return res.status(200).json({
          status: true,
          message: "Show Data and Count all data",
          data: countExpert,
        });
      } else {
        return res.status(400).json({
          status: false,
          message: "Data not found",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  };

  exports.todaysChatCount = async (req, res) => {
    try {
      const today = moment().startOf('day');
      const tomorrow = moment(today).add(1, 'days');
    
      const regular_user_type = "1"; // Regular user type
      const expert_user_type = "2"; // Expert user type
    
      // Count users of type 1 (regular users)
      const countUsers = await User.findAndCountAll({
        where: {
          createdAt: {
            [Op.between]: [today, tomorrow]
          },
          user_type: regular_user_type,
        },
        order: [['id', 'DESC']]
      });
    
      // Count chats between regular users and experts
      const countChats = await Chat.findAndCountAll({
        where: {
          createdAt: {
            [Op.between]: [today, tomorrow]
          },
          [Op.or]: [
            { user_type: regular_user_type, user_type: expert_user_type }, // Sender is a regular user and receiver is an expert
            { user_type: expert_user_type, user_type: regular_user_type }  // Sender is an expert and receiver is a regular user
          ]
        },
        order: [['id', 'DESC']]
      });
    
      if (countUsers && countChats) {
        return res.status(200).json({
          status: true,
          message: "Show Data and Count all data",
          userCount: countUsers.count,
          chatCount: countChats.count,
        });
      } else {
        return res.status(400).json({
          status: false,
          message: "Data not found",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  };