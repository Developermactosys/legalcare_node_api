const db = require("../../../config/db.config");
const User = db.User;
const Notification = db.notification;

exports.view_notification = async (req, res) => {
  try {
    const { user_id } = req.body;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Validating request
    if (!user_id) {
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

    count = await Notification.findAndCountAll({
      where: { UserId: user_id, is_read: 0 },
    });

    if (count.count > 0) {
      
      // Updating notification status is_read = 1

      await Notification.update({ is_read: 1 }, { where: { UserId: user_id } });
    }
    notification = await Notification.findAll({
      where: {
        UserId: user_id,
      },
      order: [["id", "DESC"]],
      limit: limit,
      offset: offset,
    });

       const totalCount = await Notification.count({});
       const totalPages = Math.ceil(totalCount / limit);


    if (notification) {
      return res.status(200).json({
        status: true,
        message: "All user notifications",
        count: count.count,
        data: notification,
        currentPage: page,
        totalPages: totalPages,
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "No notifications found for the user",
        data: notification,
        count: count.count,
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
