// controllers/chatController.js
const db = require("../../../config/db.config");
const User = db.User;
const Chat = db.chat;
const sequelize = require('sequelize');

exports.getChatList_by_user_id = async (req, res) => {
  try {
    const { user_id } = req.query;
    const chatList = await Chat.findAll({
      where: {
        [sequelize.Op.or]: [
          { sender_id: user_id },
          { receiver_id: user_id }
        ]
      },
      attributes: ['id', 'sent_date', 'sent_time', 'message'],
      include: [
        { model: User, 
            as: 'User', 
            attributes: ['id', 'name', 'profile_image'] 
        },
        { model: User, 
            as: 'User', 
            attributes: ['id', 'name', 'profile_image'] 
        }
      ],
      group: ['receiver_id', 'sender_id'],
      order: [['sent_date', 'DESC']]
    });
    res.json({ data: chatList, status: true, message: "Chat List retrieved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
