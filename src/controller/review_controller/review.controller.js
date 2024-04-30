// controllers/astroReviewController.js
const db = require("../../../config/db.config")
const  User = db.User; 
const  AstroReview = db.expert_review;

// async function postAstroReview(req, res) {
//     try {
//         const { expert_id, user_id, rating, message, reply } = req.body;

//         // Validate input
//         if (!expert_id || !user_id || !rating) {
//             return res.status(200).json({
//                 status: false,
//                 message: "Please provide expert_id, user_id, and rating",
//             });
//         }

//         // Check if user exists
//         const checkUser = await User.findByPk(user_id);
//         if (!checkUser) {
//             return res.status(200).json({
//                 status: false,
//                 message: "User not found",
//             });
//         }

//         // Insert review
//         const result = await AstroReview.create({
//             expert_id :  expert_id,
//             UserId:user_id,
//             review: message,
//             reply : reply,
//             rating : rating,
            
//         });

        
//          // check expert exists 
//          const checkExpert = await User.findByPk(expert_id);
//          const addRating = parseFloat(result.rating)//3

//          const extisting_rating =parseFloat(checkExpert.user_rating)
//          const updated_rating = parseFloat(extisting_rating + addRating )
//          checkExpert.rating = updated_rating
//          await checkExpert.save()
//          const final_updated_rating  = parseFloat(updated_rating)


//          const add_rating = await User.update({
//             user_rating:final_updated_rating 
//           },
//         {
//             where:{id:expert_id}
//         })

//         if (result) {
//             return res.json({
//                 status: true,
//                 user_id,
//                 message: "Your feedback has been submitted successfully",
//             });
//         } else {
//             return res.status(200).json({
//                 status: false,
//                 message: "Something went wrong",
//             });
//         }
//     } catch (error) {
//         console.log(error)

//         res.status(500).json({
//             status: false,
//             message: error.message,
            
//         });
//     }
// }

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
         const checkExpert = await User.findByPk(expert_id);//16
         const addRating = parseFloat(result.rating)//3



        //  const extisting_rating =parseFloat(checkExpert.user_rating)//4 ----215
        //  const updated_rating = parseFloat(extisting_rating + addRating )//7
         

        const findExpertCount = await AstroReview.count({
            where : {
                expert_id : expert_id
            }
        })//count-

        const findExpertRating = await AstroReview.sum('rating',{
            where : {
                expert_id : expert_id
            }
        })//sum--
        const final_updated_rating  = parseFloat(findExpertRating/findExpertCount)
        
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
           return res.status(200).json({
                status: true,
                message: "All reviews",
                review: reviews,
            });
        } else {
            return res.status(200).json({
                status: false,
                message: "No reviews found",
            });
        }
    } catch (error) {
        console.error(error);
       return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
}

module.exports = { postAstroReview, getAstroReviewList };
