// controllers/astroReviewController.js
const db = require("../../../config/db.config")
const  User = db.User; 
const  AstroReview = db.expert_review;

async function postAstroReview(req, res) {
    try {
        const { expert_id, user_id, rating, message, reply } = req.body;

        // Validate input
        if (!expert_id || !user_id || !rating) {
            return res.status(400).json({
                status: false,
                message: "Please provide expert_id, user_id, and rating",
            });
        }

        // Check if user exists
        const checkUser = await User.findByPk(user_id);
        if (!checkUser) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }

        // Insert review
        const result = await AstroReview.create({
            expert_id :  expert_id,
            UserId:user_id,
            review: message,
            reply : reply,
            rating : rating,
            
        });

        if (result) {
            return res.json({
                status: true,
                user_id,
                message: "Your feedback has been submitted successfully",
            });
        } else {
            return res.status(500).json({
                status: false,
                message: "Something went wrong",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
}

async function getAstroReviewList(req, res) {
    try {
        const { expert_id } = req.body;

        // Fetch reviews
        const reviews = await AstroReview.findAll({
            where: { expert_id : expert_id },
            include: [{ 
                model: User,
                as:"User",
                attributes: ['id','name','user_type','address','profile_image'] }],
        });

        if (reviews) {
            res.json({
                status: true,
                review: reviews,
                message: "All reviews",
            });
        } else {
            res.json({
                status: false,
                message: "No reviews found",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
}

module.exports = { postAstroReview, getAstroReviewList };
