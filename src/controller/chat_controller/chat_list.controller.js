const db = require("../../../config/db.config");
const User = db.User;
const Chat = db.chat;
const { Op, Sequelize } = require("sequelize"); // Import Op for Sequelize operators

exports.getChatList_by_user_id = async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.query;
    if (!sender_id && !receiver_id) {
      return res.status(400).json({
        status: false,
        msg: "Please provide your sender_id and receiver_id",
      });
    }
    // Find all chats where the user is either the sender or the receiver
    const chatList = await Chat.findAll({
      where: {
        [Sequelize.Op.or]: [
          {
            from_user_id: sender_id,
            to_user_id: receiver_id,
          },
          {
            from_user_id: receiver_id,
            to_user_id: sender_id,
          },
        ],
      },
      // attributes: [ 'message','sent_date', 'sent_time' ],
      // order: [['id', 'DESC']]
    });

    res.json({
      status: true,
      message: "Chat List retrieved successfully",
      chatList: chatList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.getUserList_by_user_id = async (req, res) => {
  console.log("chat");
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({
        status: false,
        msg: "Please provide your user_id",
      });
    }
    // Find all distinct users with whom the specified user has had chats
    const userList = await User.findAll({
      where: {
        [Op.or]: [
          Sequelize.literal(
            `id IN (SELECT DISTINCT from_user_id FROM chats WHERE to_user_id = ${user_id})`
          ),
          Sequelize.literal(
            `id IN (SELECT DISTINCT to_user_id FROM chats WHERE from_user_id = ${user_id})`
          ),
        ],
      },
      attributes: [
        "id",
        "name",
        "profile_image",
        // Subquery to get the last message sent/received by each user
        [
          Sequelize.literal(
            "(SELECT chat_message FROM chats WHERE (from_user_id = User.id OR to_user_id = User.id) ORDER BY message_date DESC, message_time DESC LIMIT 1)"
          ),
          "last_message",
        ],
        // Subquery to get the last message sent/received date by each user
        [
          Sequelize.literal(
            '(SELECT CONCAT(message_date, " ", message_time) FROM chats WHERE (from_user_id = User.id OR to_user_id = User.id) ORDER BY message_date DESC, message_time DESC LIMIT 1)'
          ),
          "last_message_date",
        ],
        [
          Sequelize.literal(`(
              SELECT COUNT(to_user_id= ${user_id} AND unread_msg = 0) 
              FROM chats 
              WHERE to_user_id = ${user_id} AND unread_msg = 0
            )`),
          "unread_msg",
        ],
      ],
      order: [["id", "DESC"]],
    });


    
    res.json({
      status: true,
      message: "User list retrieved successfully",
      userList: userList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
