// API for astro reject approval
const db = require("../../../config/db.config");

const User = db.User;
const chat_request = db.chat_request;
const walletSystem = db.wallet_system;
const crypto = require('crypto')
const axios = require('axios')
const { Op } = require('sequelize')

// API for astro reject approval
exports.rejectAstroChatRequest = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      status: false,
      code: 201,
      message: "id is required",
      data: req.body,
    });
  }

  try {
    // Update chat request
    await chat_request.update(
      {
        approve_time: new Date(),
        status: 'Rejected',
      },
      {
        where: { id: id },
      }
    );

    // Fetch the updated chat request and related user info
    const chatRequest = await chat_request.findOne({
      where: { id: id },
      // include: [
      //   {
      //     model: chat_request,
      //     as: 'to_user_id', 
      //   },
      //   {
      //     model: chat_request,
      //     as: 'from_user_id', 
      //   },
      // ],
    });

    if (!chatRequest) {
      return res.status(404).json({ message: 'Chat request not found' });
    }

    const { to_user_id, from_user_id } = chatRequest;

    // Send FCM notification
    const message = {
      notification: {
        title: `Chat Request rejected by ${to_user_id.name}`,
        body: `Chat Request rejected by ${from_user_id.name}`,
        image: process.env.IMAGE,
      },
      data: {
        id: String(chatRequest.id),
        sender_id: String(from_user_id.id),
        receiver_id: String(to_user_id.id),
        user_name: to_user_id.name,
        per_minute: String(to_user_id.per_minute),
        user_image: process.env.IMAGE,
        type: 'astrologer',
        notification_type: 'user_reject_request',
        time: String(Date.now()),
        title: `Incoming chat request from ${to_user_id.name}`,
        icon: 'https://collabdoor.com/public/front_img/Logo-removebg-preview%201.png',
        image: process.env.IMAGE,
      },
      token: to_user_id.device_id,
    };

    fcm.send(message, function (err, response) {
      // console.log("1", message);
      if (err) {
        console.log("Something Has Gone Wrong !");
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
          message: 'Chat request rejected successfully',
          data: response.data,
        });
      }
    });
  } catch (error) {
    console.error('Error rejecting chat request:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};