// controllers/chatController.js
const db = require("../../../config/db.config");

const  Chat = db.chat;


 const  addCallChat = async (req, res) => {
    try {
      const {
        sender_id,
        receiver_id,
        message,
        device_id,
        user_id,
      } = req.body;

      // Validate request data
      if (!sender_id || !receiver_id || !message || !device_id || !user_id) {
        return res.status(400).json({
          status: false,
          message: 'Please provide sender_id, receiver_id, message, device_id, and user_id.',
        });
      }

      const time = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Calcutta',
      });

      // Create chat record
      const result = await Chat.create({
        sender_id,
        receiver_id,
        message,
        device_id,
        UserId:user_id,
        sent_date: new Date(),
        sent_time: time,
      });

      if (result) {
        // Send Notification
        const msgs = message;
        // Implement sendNotification function

        const data = {
          status: true,
          message: msgs,
        };
        return res.status(200).json(data);
      } else {
        return res.status(500).json({
          status: false,
          message: 'Chat Not Added',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        status: false,
        message: 'Something went wrong.',
      });
    }
  }

module.exports = { addCallChat };
