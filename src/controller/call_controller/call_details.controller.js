// controllers/callHistoryController.js
const db = require("../../../config/db.config");
const {Sequelize} = require("sequelize");
const User = db.User;
const CallDetail = db.call_details;

const callHistoryController = async (req, res) => {
    try {
        const { user_id, user_type } = req.body;
        let callDetails;

        if (user_type === "1") {
            callDetails = await CallDetail.findAll({
                where: { UserId: user_id },
                include: [
                    {
                        model: User,
                        as: "User",
                    },
                ],
                order: [['id', 'DESC']],
            });

        } else if (user_type === "2") {
            callDetails = await CallDetail.findAll({
                where: { expert_id: user_id },
                include: [
                    {
                        model: User,
                        as: "User",
                        where: { id: Sequelize.col('call_details.expert_id') }
                    },
                ],
                order: [['id', 'DESC']],
            });

        }

        const response = {
            status: true,
            message: 'Call History retrieved successfully',
            data: callDetails,
        };
        res.status(200).json(response);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
        });
    }
};

module.exports = { callHistoryController };
