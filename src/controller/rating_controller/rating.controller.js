const db = require("../../../config/db.config")
const User = db.User;
const Rating = db.rating;
const review = db.expert_review

// API for add rating
const addRatingBar = async (req, res) => {
  const { UserId, rating } = req.query;
  try {
    const userData = await User.findByPk(UserId);
    if (!userData) {
      return res.status(200).json({
        status: false,
        message: "User not found",
      });
    } else {
      const createRating = await Rating.create({
        rating: rating,
        UserId: UserId
      });
      if (createRating) {
        return res.status(200).json({
          status: true,
          message: "Rating added successfully",
          data: createRating,
        });
      } else {
        return res.status(200).json({
          status: false,
          message: "rating are not added ",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// API for get rating bar
// const getAllRatings = async (req, res) => {
//   try {
//     const { expert_id } = req.body;
//     const getDetail = await review.findAndCountAll({
//       where: {
//         expert_id: expert_id
//       },
//       include: [{
//         model: User,
//         as: "User",
//         attributes: ['id', 'name', 'profile_image']
//       }],
//       attributes: ['id', 'review', 'rating', 'createdAt']
//     });

//     if (getDetail.count > 0) {
//       let totalRating = 0;
//       const ratingsCount = {};
//       let totalReviews = 0; // Initialize total reviews counter

//       // Processing each rating and counting reviews
//       getDetail.rows.forEach(row => {
//         const { rating } = row;
//         totalRating += rating; // Add to total rating
//         ratingsCount[rating] = (ratingsCount[rating] || 0) + 1; // Count occurrences of each rating
//         totalReviews += 1; // Increment total reviews count for each row processed
//       });

//       // Create a summary string from ratingsCount
//       const ratingsSummary = Object.entries(ratingsCount)
//         .map(([rating, count]) => `${rating} : ${count}`)
//         .join(', ');

//       return res.status(200).json({
//         status: true,
//         message: "Show all ratings and reviews",
//         data: getDetail.rows, // The detailed rows data
//         ratingsSummary, // Summary of ratings
//         totalRating, // Sum of all ratings
//         totalReviews // Total number of reviews processed
//       });
//     } else {
//       return res.status(404).json({
//         status: false,
//         message: "Ratings and reviews not found"
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message
//     });
//   }
// };
const getAllRatings = async (req, res) => {
  try {
    const { expert_id } = req.body;
    const getDetail = await review.findAndCountAll({
      where: {
        expert_id: expert_id
      },
      include: [{
        model: User,
        as: "User",
        attributes: ['id', 'name', 'profile_image']
      }],
      attributes: ['id', 'review', 'rating', 'createdAt']
    });

    if (getDetail.count > 0) {
      let totalRating = 0;
      const ratingsCount = { '3': 0, '4': 0, '5': 0 }; // Initialize ratings count for each star

      // Processing each rating and counting reviews
      getDetail.rows.forEach(row => {
        const { rating } = row;
        totalRating += rating; // Add to total rating
        ratingsCount[rating] += 1; // Increment count of respective star rating
      });

      // Create a summary string for ratings count
      const ratingsSummary = Object.entries(ratingsCount)
        .map(([rating, count]) => `${rating} star rating: ${count}`)
        .join(', ');

      return res.status(200).json({
        status: true,
        message: "Show all ratings and reviews",
        data: getDetail.rows, // The detailed rows data
        "3 star rating": ratingsCount['3'] || 0,
        "4 star rating": ratingsCount['4'] || 0,
        "5 star rating": ratingsCount['5'] || 0, // Summary of ratings
        totalRating, // Sum of all ratings
        totalReviews: getDetail.count // Total number of reviews processed
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "Ratings and reviews not found"
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};


module.exports = {
  addRatingBar,
  getAllRatings
};
