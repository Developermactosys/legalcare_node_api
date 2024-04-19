const db = require("../../../config/db.config")
const Message = db.chat;

const messageUser = async (req, res) => {
  try {
    const { sender_id } = req.body;

    const newMessage = await Message.create(req.body)
    // Saving the sender_id as UserId in chat table
    newMessage.UserId=sender_id

    await newMessage.save();

console.log("=====CHAT=====>",newMessage.UserId);

    if (newMessage) {
      return res.status(200).json({
        status: true,
        message: "send message succesfull",
        data: newMessage,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "do not message",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const messages = await Message.findAll({
      order: [['id', 'DESC']],
      limit: limit,
      offset: offset,
    });
    const totalCount = await Message.count({});
    const totalPages = Math.ceil(totalCount / limit);


    if (messages) {
      return res.status(200).json({
        status: true,
        message: "get all messages",
        data: messages,
        count: totalCount,
        currentPage: page,
        totalPages: totalPages,
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "Data not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


const sendMessageWithImage = async (req, res) => {
  try {
      const { from_user_id, to_user_id, message_type} = req.body;

      // Assuming you have already handled file upload and stored the file path in req.file.path
      const filePathMessage = req.file
      ? `chat_message/${req.file.filename}`
      : "/src/uploads/chat_message/default.png";
      

      const message = await Message.create({
          from_user_id,
          to_user_id,
          message_status: 1,
          chat_message: filePathMessage, // Assuming you store image path as chat_message
          image: filePathMessage,
          message_time: new Date().toLocaleTimeString(),
          message_type,
          message_date: new Date().toISOString().split('T')[0],
      });

      return res.json({
          status: true,
          data: message,
          message: 'Message sent successfully',
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          status: false,
          error: 'Internal server error',
      });
  }
};

module.exports = {
    messageUser,
    getAllMessages,
    sendMessageWithImage
}
