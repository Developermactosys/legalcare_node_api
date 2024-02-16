
// API for reject User Chat Request
const db = require("../../../config/db.config");

const User = db.User;
const chat_request = db.chat_request;
const walletSystem = db.wallet_system;
const crypto = require('crypto')
const axios = require('axios')
const { Op } = require('sequelize')

exports.cancelRequest = async (req, res) => {
    try {
        const { receiver_id, sender_id } = req.body;
        const serverKey = process.env.SERVER_KEY_HERE; 
        const fcmUrl = process.env.FCMURL;
  
        const user = await User.findByPk(receiver_id);
        const astro = await User.findByPk(sender_id);
  
        if (!user || !astro) {
            return res.status(404).send({ success: false, message: "User or Astrologer not found" });
        }
  
        const headers = {
            Authorization: `key=${serverKey}`,
            "Content-Type": "application/json",
        };
  
        const notificationPayload = {
            notification: {
                title: `Your request has been cancelled from ${astro.name}`,
                body: `Your request has been cancelled ${astro.name}`,
                priority: "high",
                image: process.env.image,
            },
            data: {
                id: "",
                user_name: astro.name,
                user_image: "https://collabdoor.com/public/front_img/Logo-removebg-preview%201.png",
                type: "customer",
                notification_type: "cancel",
                time: Date.now(),
                title: `Your chat request accepted from ${astro.name}`,
                icon: "https://collabdoor.com/public/front_img/Logo-removebg-preview%201.png",
                image: process.env.image,
                sound: "http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3",
            },
            to: user.device_id,
        };
  
        const response = await axios.post(fcmUrl, notificationPayload, { headers });
        return res.json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal Server Error" });
    }
  };