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



// exports.getUserList_by_user_id = async (req, res) => {
//   console.log("chat");
//   try {
//     const { user_id } = req.query;
//     if (!user_id) {
//       return res.status(400).json({
//         status: false,
//         msg: "Please provide your user_id",
//       });
//     }
//     // Find all distinct users with whom the specified user has had chats
//     const userList = await User.findAll({
//       attributes: [
//         "id",
//         "name",
//         "profile_image",
//         [Sequelize.literal(`EXISTS (
//             SELECT 1 FROM chats 
//             WHERE (chats.from_user_id = User.id OR chats.to_user_id = User.id)
//             AND chats.to_user_id = ${user_id}
//             AND chats.unread_msg = 0
//           )`), "unread_msg"
//         ],
//         // Add other attributes you need from the Users table
//       ],
//       where: {
//         [Op.or]: [
//           { '$Chat.from_user_id$': Sequelize.col('User.id') },
//           { '$Chat.to_user_id$': Sequelize.col('User.id') }
//         ],
//         '$Chat.to_user_id$': user_id,
//         '$Chat.unread_msg$': 0
//       },
//       include: [
//         {
//           model: Chat,
//           as: 'chat',
//           required: false,
//           attributes: [],
//         }
//       ],
//       group: ['User.id']
//     });

//     res.json({
//       status: true,
//       message: "User list retrieved successfully",
//       userList: userList,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: false, message: "Internal server error" });
//   }
// };





// const { User, Sequelize } = require('sequelize');



// exports.getUserList_by_user_id = async (req, res) => {
//   const { user_id } = req.query;
//   if (!user_id) {
//     return res.status(400).json({
//       status: false,
//       msg: "Please provide your user_id",
//     });
//   }

//   let sql = `SELECT 
//   users.id,
//   users.profile_image,
//   users.name,
//   chats.from_user_id,
//   chats.to_user_id,
//   chats.chat_message,
//   CONCAT(chats.message_date, " ", chats.message_time) as last_message_date,
//   COUNT(CASE WHEN chats.to_user_id= ${user_id} AND chats.unread_msg  = 0 THEN 1 END) AS unread_count
// FROM 
//   chats 
// RIGHT JOIN 
//   users 
// ON 
//   (chats.from_user_id = users.id OR chats.to_user_id = users.id )
// WHERE 
//   chats.to_user_id = ${user_id}
// GROUP BY chats.from_user_id 
// ORDER BY 
//   chats.message_date DESC, 
//   chats.message_time DESC;`

//   try {
//     const results = await User.sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });

//     if (results.length > 0) {
//       // console.log(results.unread_count/2);
//       return res.send({
//         status: true,
//         message: "Get Data Successfully",
//         data: results,
//       });
//     } else {
//       return res.send({
//         status: false,
//         message: "id Is Not Available",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ status: false, message: "Internal server error" });
//   }
// };


exports.getUserList_by_user_id = async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({
      status: false,
      msg: "Please provide your user_id",
    });
  }

  let sql = `SELECT 
  Users.id,
  Users.profile_image,
  Users.name,
  chats.from_user_id,
  chats.to_user_id,
  chats.chat_message,
  CONCAT(chats.message_date, " ", chats.message_time) as last_message_date,
  COUNT(CASE WHEN chats.to_user_id= ${user_id} AND chats.unread_msg  = 0 THEN 1 END) AS unread_count
FROM 
  chats 
RIGHT JOIN 
  Users 
ON 
  (chats.from_user_id = Users.id OR chats.to_user_id = Users.id )
WHERE 
  chats.to_user_id = ${user_id}
  GROUP BY chats.from_user_id 
  ORDER BY 
    chats.message_date DESC, 
    chats.message_time DESC;`

  try {
    const results = await User.sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });

    if (results.length > 0) {
      results.forEach(result => {
       result.unread_count /= 2; // Divide unread_count by 2
      //  result.unread_count = Math.floor(result.unread_count/2);
      });
console.log(results);
      return res.send({
        status: true,
        message: "Get Data Successfully",
        data: results,
      });
    } else {
      return res.send({
        status: false,
        message: "id Is Not Available",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};
