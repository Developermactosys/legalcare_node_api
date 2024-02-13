const db = require("../../../config/db.config")
const Message = db.chat;

const messageUser = async (req, res) => {
  try {
    const { sender_id } = req.body;

    const newMessage = await Message.create(req.body)
    // Saving the sender_id as UserId in chat table
    newMessage.UserId=sender_id
    await newMessage.save();

    if (newMessage) {
      return res.status(200).json({
        success: true,
        message: "send message succesfull",
        data: newMessage,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "do not message",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll();
    if (messages) {
      return res.status(200).json({
        success: true,
        message: "get all messages",
        data: messages,
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

module.exports = {
    messageUser,
    getAllMessages
}
