const db = require("../../../config/db.config");

const ChatRequest = db.chat_request;
const User = db.User;

exports.sendUserChatRequest = async (req, res) => {
    try {
        const input = req.params;
        const id = input.request_id;


        if (!id) {
            return res.json({ status: false, code: 400, message: 'Missing request_id in the request body' });
        }
        const request = await ChatRequest.findOne({ where: { id: id } });

        if (request) {
            // Update chat_request table
            const chatInserted = await ChatRequest.create({
                from_user_id: request.from_user_id,
                to_user_id: request.to_user_id,
                msg: request.user_type, // Assuming user_type is present in the request
                notify: 0,
                key: Math.random().toString(36).substring(7), // Generate a random key
                approve_time: new Date(),
                status: 'Waiting',
                request_date: new Date(),
            });

            // Send response
            res.json({ status: true, code: 200, message: 'Success', data:req.params });
        } else {
            res.json({ status: false, code: 201, message: 'Id not exists', data: req.params });
        }
    } catch (error) {
        console.error('Error in sendUserChatRequest:', error);
        res.status(500).json({ status: false, code: 500, message: 'Internal Server Error' });
    }
};
