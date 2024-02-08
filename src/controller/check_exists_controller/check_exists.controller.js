// controllers/userController.js

const db = require("../../../config/db.config");

const User = db.User;

exports.checkExists = async (req, res) => {
  try {
    const { email_id } = req.body;

    if (!email_id) {
      return res.status(400).json({ status: false, message: "Please enter correct email id" });
    }

    const user = await User.findOne({ where: { email_id: email_id } });

    if (!user) {
      return res.json({ status: false, message: "Email does not exist" });
    } else {
      return res.json({ status: true, message: "Email already exists" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};
