// controllers/chatRequestController.js
require("dotenv").config();
const db = require("../../../config/db.config");
const User = db.User;
const chat_request = db.chat_request;
const walletSystem = db.wallet_system;
const crypto = require('crypto')
const axios = require('axios')
const { Op } = require('sequelize')
var FCM = require("fcm-node");
const serverkey =process.env.SERVER_KEY_HERE;
var fcm = new FCM(serverkey);

// Controller function
exports.sendRequest = async (req, res) => {
  const {
    sender_id,
    receiver_id,
    is_video,
    channel_token,
    channel_name,
    is_free,
  } = req.body;

console.log("sender_id",sender_id)
console.log(receiver_id)


  try {
    const sender = await User.findByPk(sender_id);
    const receiver = await User.findByPk(receiver_id);
    const availableBalance = await walletSystem.findOne({
      where: { UserId: sender_id },
    });

    if (!receiver || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    // const isVideoStatus = is_video == 1 ? "Video_request" : "send_request";
    // const vcParam = is_video == 1 ? "video call" : "chat";
    const vcParam = is_video === 0 ? "chat" : is_video === 1 ? "video call" : is_video === 2 ? "audio call" : null;
    const isVideoStatus = is_video === 0 ? "send_request" : is_video === 1 ? "Video_request" : is_video === 2 ? "Audio_request" : null;

    if (!vcParam || !isVideoStatus) {
      return res.status(400).json({ message: "Invalid request type" });
    }

    const astroCharge = receiver.per_minute * 5;

    if (astroCharge <= availableBalance.wallet_amount || is_free == 1) {
      const key = crypto.randomBytes(6).toString("hex");
      const newChatRequest = await chat_request.create({
        from_user_id: sender_id,
        to_user_id: receiver_id,
        status: "Pending",
        msg: "Chat",
        notify: 1,
        key,
        request_date: new Date(),
      });

      var message = {
        to: receiver.device_id,
        collapse_key: "green",
        
        notification: {
          title: `Incoming ${vcParam} request from ${sender.name}`,
          body: `Incoming ${vcParam} request from ${sender.name}`,
          priority: "high",
          image: `/src/uploads/profile_image/${sender.profile_image}`,
        },
        data: {
          click_action: "FLUTTER_NOTIFICATION_CLICK",
          notification_type: 1,
          id: newChatRequest.id,
          sender_id,
          receiver_id,
          user_name: sender.name,
          per_minute: receiver.per_minute,
          free_time: receiver.free_time,
          channel_token,
          channel_name,
          user_image: `/src/uploads/profile_image/${sender.profile_image}`,
          type: "astrologer",
          notification_type: isVideoStatus,
          time: Date.now(),
          title: `Incoming chat request from ${sender.name}`,
          icon: "",
          image: `/src/uploads/profile_image/${sender.profile_image}`,
          sound: "",
        },
      };

      fcm.send(message, function (err, response) {
        // console.log("1", message);
        if (err) {
          console.log("Something Has Gone Wrong !",err);
          return res.status(400).json({
            success : false,
            message : err.message
          })
        } else {
          console.log("Successfully Sent With Resposne :", response);
          var body = message.notification.body;
          console.log("notification body for add order <sent to manager>", body);
          return res.json({
            success: true,
            message: "Send request successfully",
            did: receiver.device_id,
            chat_request_id: newChatRequest.id,
          });
        }
      })
    } else {
      const message = `Minimum balance of 5 minutes (INR ${astroCharge}) is required to start chat with ${receiver.name}`;
      return res.status(400).json({
        success: false,
        message,
        did: receiver.device_id,
      });
    }
  } catch (error) {
    console.error("Error in sendRequest:", error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};






