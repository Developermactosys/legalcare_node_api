
// // controllers/chatController.js
const db = require("../../../config/db.config");
const User = db.User;
const Chat = db.chat;
const { Op } = require('sequelize'); // Import Op for Sequelize operators

exports.getChatList_by_user_id = async (req, res) => {
  try {
    const { user_id } = req.query;

    // Find all chats where the user is the sender
    const chatList_as_sender = await Chat.findAll({
      where: { sender_id: user_id },
      attributes: ['id', 'sent_date', 'sent_time', 'message'],
      include: [{
        model: User,
        as: 'User', // Use alias for clarity
        attributes: ['id', 'name', 'profile_image']
      }],
      order: [['sent_date', 'DESC']]
    });

    // Find all chats where the user is the receiver
    const chatList_as_receiver = await Chat.findAll({
      where: { receiver_id: user_id },
      attributes: ['id', 'sent_date', 'sent_time', 'message'],
      include: [{
        model: User,
        as: 'User', // Use alias for clarity
        attributes: ['id', 'name', 'profile_image']
      }],
      order: [['sent_date', 'DESC']]
    });

    res.json({
      status: true,
      message: "Chat List retrieved successfully",
      Chatdata_as_sender: chatList_as_sender,
      Chatdata_as_receiver: chatList_as_receiver,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};



