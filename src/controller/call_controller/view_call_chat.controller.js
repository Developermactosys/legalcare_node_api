// controllers/chatController.js
const db = require("../../../config/db.config");

const sequelize = require("sequelize");
const  call_details = db.call_details;

 const view_call_details=  async (req, res) => {
    try {
      const { user_id, expert_id } = req.body;

      const chatHistory = await call_details.findAll({
        where: {
          [sequelize.Op.or]: [
            { UserId: expert_id, expert_id: user_id },
            { UserId: user_id, expert_id: expert_id },
          ],
        },
      });

      if (chatHistory.length > 0) {
        return res.status(200).json({
          status: true,
          message: 'User and Expert details Found',
          data: chatHistory,
        });
      } else {
        return res.status(404).json({
          status: false,
          data: null,
          message: 'No Data Found',
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
module.exports = { view_call_details };
