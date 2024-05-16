// controllers/userController.js
const db = require("../../../config/db.config");

const User = db.User;
const { validationResult } = require('express-validator');

exports.logoutUpdate = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      code: 201,
      message: errors.array()[0].msg,
      data: req.body,
    });
  }

  try {
    const user_id = req.body.user_id;
    // Check if the user exists
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      return res.json({
        status: false,
        message: "User id does not matched",
      });
    }

    // Update user status and device_id
    const result = await User.update(
      {  user_status: 'Offline' },
      { where: { id: user_id } }
    );

    if (result[0] > 0) { // Sequelize update returns an array where the first element is the number of affected rows
      res.json({
        status: true,
        message: "User Successfully logout",
      });
    } else {
      res.json({
        status: false,
        message: "No data found for entered user id",
      });
    }
  } catch (error) {
    console.error('Logout Update Error:', error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating user status.",
    });
  }
};
