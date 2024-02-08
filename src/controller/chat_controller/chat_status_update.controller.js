// controllers/chatController.js
const db = require("../../../config/db.config");

const ChatActiveStatus = db.chat_active_status;

exports.updateChatStatus = async (req, res) => {
  try {
    const { astro_id, start_time, end_time, status } = req.body;
    // Validate astro_id, start_time, end_time, status

    let chatStatus = await ChatActiveStatus.findOne({ where: { astro_id : astro_id} });

    if (!chatStatus) {
      chatStatus = await ChatActiveStatus.create({
        astro_id,
        start_time,
        end_time,
        chat_status: status,
        status
      });
    } else {
      await chatStatus.update({ start_time, end_time, chat_status: status, status });
    }

    // Update other tables as needed

    res.json({ status: true, message: "Chat status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
