// controllers/astrologerController.js

const db = require("../../../config/db.config");

const User = db.User;

exports.expert_list = async (req, res) => {
  try {
    const {user_type} = req.body;

    const page = Number(req.body.page) || 1;
  const limit = Number(req.body.limit) || 5;
  const offset = Number(req.body.offset) || 0;
   

    // Fetch users directly without counting
    const users = await User.findAll({
      where: {
        user_type: user_type,
        user_status: "1",
        chat_active: 1,
        call_active: 1,
      },
      limit: limit,
      offset: offset,
    });

    const totalCount = await User.count({});
    const totalPages = Math.ceil(totalCount / limit)

    if (users.length > 0) { // Ensure we got results for the specified user types
      return res.status(200).json({
        status: true,
        message: "Showing Data of expert list",
        list: users,
        currentPage: page,
        totalPages,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: `Data not found for user_type ${user_type}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
