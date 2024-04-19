// controllers/astroReviewController.js
const db = require("../../../config/db.config")
const  User = db.User; 
const  AstroReview = db.expert_review;

async function postAstroReview(req, res) {
    try {
        const { expert_id, user_id, rating, message, reply } = req.body;

        // Validate input
        if (!expert_id || !user_id || !rating) {
            return res.status(200).json({
                status: false,
                message: "Please provide expert_id, user_id, and rating",
            });
        }

        // Check if user exists
        const checkUser = await User.findByPk(user_id);
        if (!checkUser) {
            return res.status(200).json({
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

        
         // check expert exists 
         const checkExpert = await User.findByPk(expert_id);
         const addRating = parseFloat(result.rating)//3

         const extisting_rating =parseFloat(checkExpert.user_rating)
         const updated_rating = parseFloat(extisting_rating + addRating )
         checkExpert.rating = updated_rating
         await checkExpert.save()
         const final_updated_rating  = parseFloat(updated_rating)


         const add_rating = await User.update({
            user_rating:final_updated_rating 
          },
        {
            where:{id:expert_id}
        })

        if (result) {
            return res.json({
                status: true,
                user_id,
                message: "Your feedback has been submitted successfully",
            });
        } else {
            return res.status(200).json({
                status: false,
                message: "Something went wrong",
            });
        }
    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: false,
            message: error.message,
            
        });
    }
}

// async function postAstroReview(req, res) {
//     try {
//         const { expert_id, user_id, rating, message, reply } = req.body;

//         // Validate input
//         if (!expert_id || !user_id || !rating) {
//             return res.status(400).json({
//                 status: false,
//                 message: "Please provide expert_id, user_id, and rating",
//             });
//         }

//         // Check if user exists
//         const checkUser = await User.findByPk(user_id);
//         if (!checkUser) {
//             return res.status(404).json({
//                 status: false,
//                 message: "User not found",
//             });
//         }

//         // Insert review
//         const result = await AstroReview.create({
//             expert_id: expert_id,
//             UserId: user_id,
//             review: message,
//             reply: reply,
//             rating: rating,
//         });

//         // Update user's rating
//         const updatedUser = await User.findByPk(user_id);
//         if (updatedUser) {
//             // Calculate new average rating
//             const currentRating = parseFloat(updatedUser.user_rating || 0);
//             const reviewCount = updatedUser.review_count || 0;

//             // Calculate new average rating based on existing reviews and the new rating
//             const newRating = ((currentRating * reviewCount) + rating) / (reviewCount + 1);

//             // Update user's rating and increment review count
//             await updatedUser.update({
//                 user_rating: newRating,
//                 // review_count: reviewCount + 1,
//             });

//             return res.status(200).json({
//                 status: true,
//                 user_id: user_id,
//                 message: "Your feedback has been submitted successfully",
//             });
//         } else {
//             return res.status(404).json({
//                 status: false,
//                 message: "User not found",
//             });
//         }
//     } catch (error) {
//         res.status(500).json({
//             status: false,
//             message: error.message,
//         });
//     }
// }


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
