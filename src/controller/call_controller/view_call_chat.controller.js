// controllers/chatController.js
const db = require("../../../config/db.config");

const sequelize = require("sequelize");
const  Chat = db.chat;

 const viewCallChat=  async (req, res) => {
    try {
      const { sender_id, receiver_id } = req.body;

      const chatHistory = await Chat.findAll({
        where: {
          [sequelize.Op.or]: [
            { sender_id, receiver_id },
            { sender_id: receiver_id, receiver_id: sender_id },
          ],
        },
      });

      if (chatHistory.length > 0) {
        return res.status(200).json({
          status: true,
          data: chatHistory,
          message: 'All Chat Found',
        });
      } else {
        return res.status(404).json({
          status: false,
          data: null,
          message: 'No Chat Found',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        status: false,
        data: null,
        message: 'Internal Server Error',
      });
    }
  }
module.exports = { viewCallChat };
