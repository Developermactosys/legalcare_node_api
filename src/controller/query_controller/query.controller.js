// controllers/queryController.js
const db = require("../../../config/db.config");

const User = db.User;
const ChatHistory = db.chat_history;
const CallDetails = db.call_details;

async function getDetails(req, res) {
    try {
        const { type, id } = req.query;

        let details;

        if (type === 'chat') {
            details = await ChatHistory.findOne({
                where: { UserId : id },
                include: [{
                    model: User,
                    as: "User",
                    attributes: ['name', 'profile_image'],
                }],
            });
        } else {
            details = await CallDetails.findOne({
                where: { UserId:id },
                include: [{
                    model: User,
                    as: "User",
                    attributes: ['name', 'profile_image'],
                }],
            });
        }

        if (!details) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: 'Details not found',
                data: null,
            });
        }

        const imageUrlBasePath = 'http://134.209.229.112:7878';

        const formattedDetails = {
            id: details.id,
            astro_name: details.User.name,
            image_url: `${imageUrlBasePath}/${details.User.profile_image}`,
            // Add other necessary fields from details if needed
        };

        const data = {
            status: true,
            data: formattedDetails,
            message: 'Details retrieved successfully',
        };

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            code: 500,
            message: 'Internal Server Error',
            data: null,
        });
    }
}

module.exports = { getDetails };
