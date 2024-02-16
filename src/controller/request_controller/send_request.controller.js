// controllers/chatRequestController.js
const db = require("../../../config/db.config");

const User = db.User;
const chat_request = db.chat_request;
const walletSystem = db.wallet_system;
const crypto = require('crypto')
const axios = require('axios')
const { Op } = require('sequelize')

// API for send user Chat request
const sendPushNotification = async (deviceToken, notificationData, dataPayload) => {
    const serverKey =process.env.SERVER_KEY_HERE;
    const url=process.env.URL
    const headers = {
      Authorization: `key=${serverKey}`,
      'Content-Type': 'application/json'
    };
  
    const body = {
      notification: notificationData,
      data: dataPayload,
      to: deviceToken,
    };
  
    try {
      const response = await axios.post(url, body, { headers });
      console.log('Notification sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  };
  
  //Send Controller function
  exports.sendRequest = async (req, res) => {
    const { sender_id, receiver_id, is_video, channel_token, channel_name, is_free } = req.body;
  
    try {
      const sender = await User.findByPk(sender_id);
      const receiver = await User.findByPk(receiver_id);
      const availableBalance = await walletSystem.findOne({ where: { user_id: sender_id } });
  
      if (!receiver || !sender) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isVideoStatus = is_video == 1 ? 'Video_request' : 'send_request';
      const vcParam = is_video == 1 ? 'video call' : 'chat';
  
      const astroCharge = receiver.per_minute * 5;
  
      if (astroCharge <= availableBalance.wallet_amount || is_free == 1) {
        const key = crypto.randomBytes(6).toString('hex');
        const newChatRequest = await chat_request.create({
          from_user_id: sender_id,
          to_user_id: receiver_id,
          status: 'Pending',
          msg: 'Chat',
          notify: 1,
          key,
          request_date: new Date(),
        });
  
        const notificationData = {
          title: `Incoming ${vcParam} request from ${sender.name}`,
          body: `Incoming ${vcParam} request from ${sender.name}`,
          priority: 'high',
          image: `../uploads/${sender.profile_image}`,
        };
  
        const dataPayload = {
          id: newChatRequest.id,
          sender_id,
          receiver_id,
          user_name: sender.name,
          per_minute: receiver.per_minute,
          free_time: receiver.free_time,
          channel_token,
          channel_name,
          user_image: `../uploads/${sender.profile_image}`,
          type: 'astrologer',
          notification_type: isVideoStatus,
          time: Date.now(),
          title: `Incoming chat request from ${sender.name}`,
          icon: '',
          image: `../uploads/${sender.profile_image}`,
          sound: '',
        };
  
        await sendPushNotification(receiver.device_id, notificationData, dataPayload);
  
        return res.json({
          message: 'Send request successfully',
          status: true,
          did: receiver.device_id,
        });
      } else {
        const message = `Minimum balance of 5 minutes (INR ${astroCharge}) is required to start chat with ${receiver.name}`;
        return res.status(400).json({
          status: false,
          message,
          did: receiver.device_id,
        });
      }
    } catch (error) {
      console.error('Error in sendRequest:', error);
      return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  };
