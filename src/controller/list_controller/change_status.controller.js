const db = require("../../../config/db.config");
const User = db.User;

exports.change_expert_status = async (req, res) => {
  try {
    const { expert_id, user_status, chat_active, call_active, free_redeem, free_time } = req.body;

    const update_expert_status = await User.update({
      user_status: user_status,
      chat_active: chat_active,
      call_active: call_active,
      free_redeem: free_redeem,
      free_time: free_time
    }, 
    { where: { id: expert_id } });

    res.status(200).json({
      status: true,
      code: 200,
      message: "Expert status updated successfully",
      data: update_expert_status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      code: 500,
      message: "Internal Server Error",
    });
  }
};
