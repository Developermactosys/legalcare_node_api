const db = require("../../../config/db.config");
const User = db.User;
const Notification = db.notification;

exports.view_notification = async (req, res) => {
  try {
    const { user_id } = req.body;

    // Validating request
    if (!user_id ) {
      return res.status(400).json({
        status: false,
        code: 201,
        message: "user_id is required",
        data: req.body,
      });
    }

    // Checking if user exists
    const checkUser = await User.findOne({ where: { id: user_id } });
    if (!checkUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    let notification;
    let count;

    // Updating notification status if type is 1
    // if (type == 1) {
    //   await Notification.update({ is_read: 1 }, { where: { user_id } });
    // }

    // Fetching notifications based on user type
    
    
    notification = await Notification.findAll({
        where: {
          UserId:user_id,
        },
        order: [["id", "DESC"]],
      });
      count = await Notification.count({
        where: {UserId: user_id, is_read: 0 },
      });
    
    // else if (checkUser.user_type === 2) {
    //   notification = await Notification.findAll({
    //     where: {
    //       user_id,
    //       [Sequelize.Op.or]: [{ type: "ALL" }, { type: "astrologer" }],
    //     },
    //     order: [["id", "DESC"]],
    //   });
    //   count = await Notification.count({
    //     where: { user_id, is_read: 0 },
    //   });
    // }

    if (notification.length > 0) {
      return res.status(200).json({
        status: true,
        message: "All user notifications",
        data: notification,
        count,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "No notifications found for the user",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
