const db = require("../../../../config/db.config");
const User = db.User;
const chat = db.chat;
const { Op ,Sequelize} = require("sequelize");
const { QueryTypes } = require('sequelize')
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
    
      // Find all distinct users with whom chats have occurred today
      const userList = await User.findAll({
        where: {
          [Op.or]: [
            Sequelize.literal(`id IN (SELECT DISTINCT from_user_id FROM chats WHERE to_user_id IN (SELECT id FROM users WHERE createdAt BETWEEN '${today}' AND '${tomorrow}'))`),
            Sequelize.literal(`id IN (SELECT DISTINCT to_user_id FROM chats WHERE from_user_id IN (SELECT id FROM users WHERE createdAt BETWEEN '${today}' AND '${tomorrow}'))`)
          ]
        },
        attributes: [
          'id',
          'name',
          'profile_image',
          // Subquery to count the number of chats exchanged by each user today
          [
            Sequelize.literal(`(SELECT COUNT(*) FROM chats WHERE (from_user_id = User.id OR to_user_id = User.id) AND createdAt BETWEEN '${today}' AND '${tomorrow}')`),
            'chat_count'
          ],
        ],
        order: [['id', 'DESC']],
        logging: console.log,
      });
  
      res.json({
        status: true,
        message: "User chat count retrieved successfully",
        userList: userList
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  };
  