// controllers/queryController.js
const db = require("../../../config/db.config");

const  User  = db.User;
const ChatHistory = db.chat_history;
const CallDetails = db.call_details;

async function getDetails(req, res) {
    try {
        const { type, id } = req.query;

        let details;

        if (type === 'chat') {
            details = await ChatHistory.findOne({
                where: { id },
                include: [
                    {
                        model: User,
                        as: "User",
                        attributes: ['name', 'profile_image'],
                    },
                ],
            });
        } else {
            details = await CallDetails.findOne({
                where: { id },
                include: [
                    {
                        model: User,
                        as: "User",
                        attributes: ['name', 'profile_image'],
                    },
                ],
            });
        }

        const imageUrlBasePath = 'http://134.209.229.112/images/profile_image';

        const formattedDetails = {
            ...details.dataValues,
            astro_name: details.User.name,
            image_url: `${imageUrlBasePath}/${details.User.profile_image}`,
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
            data: '',
        });
    }
}

module.exports = { getDetails };