

const db = require("../../../config/db.config");
const User = db.User;
const Chat = db.chat;
const { Op,Sequelize  } = require('sequelize'); // Import Op for Sequelize operators


exports.getChatList_by_user_id = async (req, res) => {
  try {
    const { sender_id,receiver_id } = req.query;
if(!sender_id && !receiver_id ){
  return res.status(400).json({
    status:false,
    msg:"Please provide your sender_id and receiver_id"
  })
}
    // Find all chats where the user is either the sender or the receiver
    const chatList = await Chat.findAll({
      where: {
        [Op.and]: [
          { sender_id: sender_id },
          { receiver_id: receiver_id }
        ]
      },
      // attributes: [ 'message','sent_date', 'sent_time' ],
      order: [['id', 'DESC']]
    });

    res.json({
      status: true,
      message: "Chat List retrieved successfully",
      chatList: chatList
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};




exports.getUserList_by_user_id = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({
        status: false,
        msg: "Please provide your user_id"
      });
    }
    // Find all distinct users with whom the specified user has had chats
    const userList = await User.findAll({
      where: {
        [Op.or]: [
          Sequelize.literal(`id IN (SELECT DISTINCT sender_id FROM chats WHERE receiver_id = ${user_id})`),
          Sequelize.literal(`id IN (SELECT DISTINCT receiver_id FROM chats WHERE sender_id = ${user_id})`)
        ]
      },
      attributes: [
        'id',
        'name',
        'profile_image',
        // Subquery to get the last message sent/received by each user
        [
          Sequelize.literal('(SELECT message FROM chats WHERE (sender_id = User.id OR receiver_id = User.id) ORDER BY sent_date DESC, sent_time DESC LIMIT 1)'),
          'last_message'
        ],
        // Subquery to get the last message sent/received date by each user
        [
          Sequelize.literal('(SELECT CONCAT(sent_date, " ", sent_time) FROM chats WHERE (sender_id = User.id OR receiver_id = User.id) ORDER BY sent_date DESC, sent_time DESC LIMIT 1)'),
          'last_message_date'
        ]
      ],
      order: [['id', 'DESC']]
    });

    res.json({
      status: true,
      message: "User list retrieved successfully",
      userList: userList
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
