// API for chat Approval 
require('dotenv').config()
const db = require("../../../config/db.config");
const User = db.User;
const chat_request = db.chat_request;
const walletSystem = db.wallet_system;
const Notification = db.notification;
const crypto = require('crypto')
const axios = require('axios')
const { Op } = require('sequelize')
var FCM = require("fcm-node");
const serverkey =process.env.SERVER_KEY_HERE;
const sender_profile_image = process.env.IMAGE
var fcm = new FCM(serverkey);

exports.approveRequest = async (req, res) => {
  try {
    const { id, receiver_id, sender_id, is_video } = req.body;
    const serverKey = process.env.SERVER_KEY_HERE;
    const fcmUrl = process.env.FCMURL;

    const isVideoStatus = is_video == 0 ? "send_request" : is_video == 1 ? "Video_request" : is_video == 2 ? "Audio_request" : null;
    const vcParam = is_video == 0 ? "chat" : is_video == 1 ? "video call" : is_video == 2 ? "audio call" : null;
    if(isVideoStatus=="send_request" && vcParam=="chat"){
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

    const sender = await User.findByPk(sender_id);
      const receiver = await User.findByPk(receiver_id); //RECEIVER expert CA
    
      if (!receiver || !sender) {
        return res
          .status(404)
          .json({ success: false, message: "User or Astrologer not found" });
      }

    const wallet = await walletSystem.findOne({
      where: { UserId: sender_id },
    });
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: "Wallet not found" });
    }

          const max_time = Math.floor(wallet.wallet_amount / receiver.per_minute);
          await sender.update({ wait_time: max_time }, { where: { id: sender_id } });

    if (receiver.login_from === "web") {
              return res.json({ success: 1, failure: 0 });
            } else {
              const headers = {
                Authorization: `key=${serverKey}`,
                "Content-Type": "application/json",
              };
        
              var message = {
                to: receiver.device_id,
                collapse_key: "green",
                
                notification: {
                  title: `Your request has been accepted by ${sender.name}`,
                      body: `Your request has been accepted by ${sender.name}`,
                      priority: "high",
                      image: `${sender_profile_image}${sender.profile_image}`,
        
                },
                data: {
                  sender_id: sender_id,
                  user_name: sender.name,
                  user_image:
                    "https://collabdoor.com/public/front_img/Logo-removebg-preview%201.png",
                  type: "customer",
                  notification_type: "approved",
                  time: Date.now(),
                  title: `Chat request approved by ${sender.name}`,
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
                UserId : message.data.sender_id
              });

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
   }
    
    else  if(isVideoStatus=="Video_request"  && vcParam=="video call"){

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
  
      const sender = await User.findByPk(sender_id);
        const receiver = await User.findByPk(receiver_id); //RECEIVER expert CA
      
        if (!receiver || !sender) {
          return res
            .status(404)
            .json({ success: false, message: "User or Astrologer not found" });
        }
  
      const wallet = await walletSystem.findOne({
        where: { UserId: sender_id },
      });
      if (!wallet) {
        return res
          .status(404)
          .json({ success: false, message: "Wallet not found" });
      }
  
            const max_time = Math.floor(wallet.wallet_amount / receiver.per_minute);
            await sender.update({ wait_time: max_time }, { where: { id: sender_id } });
  
      if (receiver.login_from === "web") {
                return res.json({ success: 1, failure: 0 });
              } else {
                const headers = {
                  Authorization: `key=${serverKey}`,
                  "Content-Type": "application/json",
                };
          
                var message = {
                  to: receiver.device_id,
                  collapse_key: "green",
                  
                  notification: {
                    title: `Your request has been accepted by ${sender.name}`,
                        body: `Your request has been accepted by ${sender.name}`,
                        priority: "high",
                        image: `${sender_profile_image}${sender.profile_image}`,
                  },
                  data: {
                    sender_id: sender_id,
                    user_name: sender.name,
                    user_image:
                      "https://collabdoor.com/public/front_img/Logo-removebg-preview%201.png",
                    type: "customer",
                    notification_type: "video_approved",
                    time: Date.now(),
                    title: `Video request approved by ${sender.name}`,
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
                  UserId : message.data.sender_id
                });

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
     }

   else  if(isVideoStatus=="Audio_request" && vcParam=="audio call"){

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

    const sender = await User.findByPk(sender_id);
      const receiver = await User.findByPk(receiver_id); //RECEIVER expert CA
    
      if (!receiver || !sender) {
        return res
          .status(404)
          .json({ success: false, message: "User or Astrologer not found" });
      }

    const wallet = await walletSystem.findOne({
      where: { UserId: sender_id },
    });
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: "Wallet not found" });
    }

          const max_time = Math.floor(wallet.wallet_amount / receiver.per_minute);
          await sender.update({ wait_time: max_time }, { where: { id: sender_id } });

    if (receiver.login_from === "web") {
              return res.json({ success: 1, failure: 0 });
            } else {
              const headers = {
                Authorization: `key=${serverKey}`,
                "Content-Type": "application/json",
              };
        
              var message = {
                to: receiver.device_id,
                collapse_key: "green",
                
                notification: {
                  title: `Your request has been accepted by ${sender.name}`,
                      body: `Your request has been accepted by ${sender.name}`,
                      priority: "high",
                      image: `${sender_profile_image}${sender.profile_image}`,
                },
                data: {
                  sender_id: sender_id,
                  user_name: sender.name,
                  user_image:
                    "https://collabdoor.com/public/front_img/Logo-removebg-preview%201.png",
                  type: "customer",
                  notification_type: "audio_approved",
                  time: Date.now(),
                  title: `Audio request approved by ${sender.name}`,
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
                UserId : message.data.sender_id
              });

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
   }

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
}