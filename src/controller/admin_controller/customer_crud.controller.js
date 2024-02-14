
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>For Admin Section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
const db = require("../../../config/db.config")
const User = db.User;
const Sequelize = require("sequelize");
const wallet_system = db.wallet_system;

// API for count total user
exports.totalUser = async (req, res) => {
    try {
      const user_type = "1";
      const countUsers = await User.findAndCountAll({
        where: {
          user_type: user_type,
        },
        limit: 5,
        offset: 0,
      });
      if (countUsers) {
        return res.status(200).json({
          success: true,
          message: "Show Data and Count all data",
          data: countUsers,
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
  
  exports.getuserDetails = async (req, res) => {
    const { UserId } = req.params;
    try {
      const userDetails = await User.findByPk(UserId, {
        include: {
          model: wallet_system,
          attributes: ["wallet_amount"],
        },
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
      const userDetails = await User.findByPk(UserId);
      await userDetails.destroy(userDetails);
      if (userDetails) {
        return res.status(200).json({
          success: true,
          message: "User delete successfully",
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