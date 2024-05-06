// controllers/callHistoryController.js
const db = require("../../../config/db.config");
const {Sequelize} = require("sequelize");
const User = db.User;
const CallDetail = db.call_details;

const callHistoryController = async (req, res) => {
    try {
        const { user_id, user_type } = req.body;
        let callDetails;
        const get_user_type = await User.findOne({
            id : user_id
        })
    const get_user_type_2 = get_user_type.user_type;

        if (get_user_type_2 === "1") {
          callDetails = await CallDetail.findAll({
            where: { UserId: user_id },
            include: [
              {
                model: User,
                as: "User",
              },
            ],
            order: [["id", "DESC"]],
          });
        } else if (
          get_user_type_2 === "2" ||
          get_user_type_2 === "3" ||
          get_user_type_2 === "4"
        ) {
          callDetails = await CallDetail.findAll({
            where: { expert_id: user_id },
            include: [
              {
                model: User,
                as: "User",
                where: { id: Sequelize.col("call_details.expert_id") },
              },
            ],
            order: [["id", "DESC"]],
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
