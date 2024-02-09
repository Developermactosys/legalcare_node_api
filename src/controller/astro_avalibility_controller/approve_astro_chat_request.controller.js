const db = require("../../../config/db.config")
const admin = require('firebase-admin');
const User = db.User;
const chat_request = db.chat_request;
const axios = require('axios')





var serviceAccount = require("../../../fcm.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// API for approve Astro chat request
exports.approveAstroChatRequest = async (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                code: 201,
                message: "Request ID is required",
                data: req.body,
            });
        }

        const chatRequest = await chat_request.findByPk(id);
        if (!chatRequest) {
            return res.status(404).json({ success: false, message: "Chat request not found" });
        }

        const currentTime = new Date();
        const approveTime = new Date(chatRequest.approve_time);
        const diffMinutes = (currentTime - approveTime) / 60000;
        

        if (diffMinutes >= 2) {
            return res.status(400).json({
                success: false,
                code: 201,
                message: "Can't Approve, You reached the maximum limit of 2 minutes",
                data: [],
            });
        }

        await chat_request.update(
            { approve_time: new Date(), status: "Approve" },
            { where: { id: id } }
        );

        const astrologer = await User.findByPk(chatRequest.to_user_id);
        const user = await User.findByPk(chatRequest.from_user_id);

        const notificationPayload = {
            to: astrologer.device_id,
            notification: {
                title: `Chat Request Accepted By ${user.name}`,
                body: `Chat Request Accepted By ${user.name}`,
                priority: "high",
                image: process.env.image,
            },
            data: {
                id: chatRequest.id.toString(),
                sender_id: chatRequest.from_user_id.toString(),
                receiver_id: chatRequest.to_user_id.toString(),
                user_name: user.name,
                per_minute: astrologer.per_minute.toString(),
                user_image: `http://134.209.229.112/images/profile_image/${astrologer.profile_image}`,
                type: "astrologer",
                notification_type: "user_approve_request",
                time: Date.now(),
                title: `Chat Request Accepted By ${user.name}`,
                icon: "https://collabdoor.com/public/front_img/Logo-removebg-preview%201.png",
                image: process.env.image,
            },
        };

        const headers = {
            Authorization: `key=${process.env.SERVER_KEY_HERE}`,
            "Content-Type": "application/json",
        };

        const response = await axios.post(process.env.fcmUrl, notificationPayload, { headers });
        return res.json({ success: true, data: response.data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};