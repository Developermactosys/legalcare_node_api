const db = require("../../../../config/db.config");
const User = db.User;
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

  