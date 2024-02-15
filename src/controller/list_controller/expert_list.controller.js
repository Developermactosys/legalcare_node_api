// controllers/astrologerController.js

const db = require("../../../config/db.config");

const User = db.User;

exports.expert_list = async (req, res) => {
  try {
    const {user_type} = req.query;

    const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const offset = (page - 1) * limit; 

    // Fetch users directly without counting
    const users = await User.findAll({
      where: { user_type: user_type },
      limit: limit,
      offset: offset,
    });

    const totalCount = await User.count({});
    const totalPages = Math.ceil(totalCount / limit)

    if (users.length > 0) { // Ensure we got results for the specified user types
      return res.status(200).json({
        success: true,
        message: "Showing Data of expert list",
        data: users,
        currentPage: page,
        totalPages,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Data not found for user_type ${user_type}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
