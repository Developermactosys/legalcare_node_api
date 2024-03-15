require("dotenv").config();
// API for reject User Chat Request
const db = require("../../../config/db.config");

const User = db.User;
const chat_request = db.chat_request;
const walletSystem = db.wallet_system;
const Notification = db.notification;
const crypto = require("crypto");
const axios = require("axios");
const { Op } = require("sequelize");
var FCM = require("fcm-node");
const serverkey = process.env.SERVER_KEY_HERE;
var fcm = new FCM(serverkey);
const sender_profile_image = process.env.IMAGE;

// API for reject User Chat Request
exports.cancelRequest = async (req, res) => {
  try {
    const { receiver_id, sender_id } = req.body;
    const serverKey = process.env.SERVER_KEY_HERE;
    const fcmUrl = process.env.fcmUrl;
    console.log("sender_id", sender_id);
    console.log(receiver_id);

    const receiver = await User.findByPk(receiver_id); //Expert CA
    const sender = await User.findByPk(sender_id);

    if (!receiver || !sender) {
      return res
        .status(404)
        .send({ success: false, message: "User or Astrologer not found" });
    }

    const headers = {
      Authorization: `key=${serverKey}`,
      "Content-Type": "application/json",
    };

    var message = {
      to: receiver.device_id,
      collapse_key: "green",

      notification: {
        title: `Your request has been cancelled from ${sender.name}`,
        body: `Your request has been cancelled ${sender.name}`,
        priority: "high",
        image: `${sender_profile_image}${sender.profile_image}`,
      },
      data: {
        id: "",
        user_name: sender.name,
        user_image: `${sender_profile_image}${sender.profile_image}`,
        type: "customer",
        notification_type: "cancle",
        time: Date.now(),
        title: `Chat request cancle by ${receiver.name}`,
        icon: "https://collabdoor.com/public/front_img/Logo-removebg-preview%201.png",
        image: `${sender_profile_image}${sender.profile_image}`,
        sound:
          "http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3",
      },
      to: receiver.device_id,
    };

    await Notification.create({
      message: message.notification.body,
      type: message.data.notification_type,
      UserId :sender.id
    });

    fcm.send(message, function (err, response) {
      // console.log("1", message);
      if (err) {
        console.log("Something Has Gone Wrong !");
        return res.status(400).json({
          status: false,
          message: err.message,
        });
      } else {
        console.log("Successfully Sent With Resposne :", response);
        var body = message.notification.body;
        console.log("notification body for add order <sent to manager>", body);
        return res.json({
          success: true,
          message: "Request cancled and notification sent",
          data: response.data,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
};
