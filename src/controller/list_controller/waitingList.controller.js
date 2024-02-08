// controllers/waitingListController.js
const db = require("../../../config/db.config");

const WaitingJoinList = db.waiting_join_list;
const User = db.User;

const getWaitingList = async (req, res) => {
    try {
        const { astro_id, type } = req.query;

        const where = { astro_id };

        if (type) {
            where.user_type = type;
        }

        const exists = await WaitingJoinList.findAll({
            where: {UserId : astro_id},
            include: [{
                model: User,
                as : "User",
                attributes: ['name', 'profile_image', 'dob', 'birth_time', 'birth_place'],
            }],
        });

        res.status(200).json({
            status: true,
            code: 200,
            message: 'Waiting list get Successfully',
            data: exists,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            code: 500,
            message: 'Internal Server Error',
        });
    }
};

module.exports = {
    getWaitingList,
};
