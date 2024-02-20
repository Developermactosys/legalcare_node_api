require("dotenv").config();
const db= require("../../../config/db.config");
const  ChatRequest = db.chat_request;
const User = db.User;


var FCM = require('fcm-node');
var serverKey = process.env.SERVER_KEY_HERE;
var fcm = new FCM(serverKey);


exports.rejectUserChatRequest = async (req, res) => {
    try {
        const input = req.body;
        const id = input.request_id;

        if (!id) {
            return res.json({ status: false, code: 400, message: 'Missing request_id in the request body' });
        }

        const request = await ChatRequest.findOne({ where: { id: id } });

        if (request) {
            // Update chat_request table
            await ChatRequest.create({
                fromUserId: request.from_user_id,
                toUserId: request.to_user_id,
                msg: request.user_type,
                notify: 0,
                key: Math.random().toString(36).substring(7),
                approveTime: new Date(),
                status: 'Rejected',
                requestDate: new Date(),
            });

            // Send FCM notification
            var message = {
                to: process.env.DEVICE_ID, // Replace this with the receiver's device token
                notification: {
                    title: 'Chat Request Rejected',
                    body: 'Your chat request has been rejected.'
                },
                data: {
                    request_id: id,
                    status: 'Rejected'
                }
            };

            fcm.send(message, function(err, response) {
                if (err) {
                    console.log("Error sending FCM notification:", err);
                } else {
                    console.log("FCM notification sent successfully:", response);
                }
            });

            // Respond to the HTTP request indicating success
            res.json({ status: true, code: 200, message: 'Chat request rejected successfully', data: req.body });
        } else {
            res.json({ status: false, code: 201, message: 'Id not exists', data: req.body });
        }
    } catch (error) {
        console.error('Error in rejectUserChatRequest:', error);
        res.status(500).json({ status: false, code: 500, message: 'Internal Server Error' });
    }
};
