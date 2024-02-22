// API for chat Approval 
require('dotenv').config()
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
exports.approveRequest = async (req, res) => {
    try {
      const { id, receiver_id, sender_id } = req.body;
      const serverKey = process.env.SERVER_KEY_HERE;
      const fcmUrl = process.env.FCMURL;
  
      // Update chat_request status and notify_user
      await chat_request.update(
        {
          status: "Approve",
          approve_time: new Date(),
          notify_user: 1,
        },
        {
          where: {
            id,
            status: "Pending",
          },
        }
      );
  
      const user = await User.findByPk(receiver_id);
      const astro = await User.findByPk(sender_id);
  
      if (!user || !astro) {
        return res
          .status(404)
          .json({ success: false, message: "User or Astrologer not found" });
      }
  
      const wallet = await walletSystem.findOne({
        where: { UserId: receiver_id },
      });
      if (!wallet) {
        return res
          .status(404)
          .json({ success: false, message: "Wallet not found" });
      }
  
      const max_time = Math.floor(wallet.wallet_amount / astro.per_minute);
      await astro.update({ wait_time: max_time }, { where: { id: sender_id } });
  
      if (user.login_from === "web") {
        return res.json({ success: 1, failure: 0 });
      } else {
        const headers = {
          Authorization: `key=${serverKey}`,
          "Content-Type": "application/json",
        };
  
        var message = {
          to: user.device_id,
          collapse_key: "green",
          
          notification: {
            title: `Your request has been accepted by ${astro.name}`,
                body: `Your request has been accepted by ${astro.name}`,
                priority: "high",
                image: process.env.IMAGE,
          },
          data: {
            id: "",
            user_name: astro.name,
            user_image:
              "https://collabdoor.com/public/front_img/Logo-removebg-preview%201.png",
            type: "customer",
            notification_type: "approved",
            time: Date.now(),
            title: `Chat request approved by ${astro.name}`,
            icon: "https://collabdoor.com/public/front_img/Logo-removebg-preview%201.png",
            image: process.env.IMAGE,
            sound:
              "http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3",
          },
          to: user.device_id,
        };
  
       
  
  
        fcm.send(message, function (err, response) {
          // console.log("1", message);
          if (err) {
            console.log("Something Has Gone Wrong !");
            return res.status(400).json({
              status : false,
              message : err.message
            })
          } else {
            console.log("Successfully Sent With Resposne :", response);
            var body = message.notification.body;
            console.log("notification body for add order <sent to manager>", body);
            return res.json({
              success: true,
              message: "Request approved and notification sent",
              data: response.data,
            });
          }
        })
  
  
       }
     } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  };
  
  