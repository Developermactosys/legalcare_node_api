const db = require("../../../config/db.config")
const User = db.User;
const Rating = db.rating;

// API for add rating
const addRatingBar = async (req, res) => {
  const { UserId ,rating } = req.query;
  try {
    const userData = await User.findByPk(UserId);
    if (!userData) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    } else {
      const createRating = await Rating.create({
        rating : rating,
        UserId : UserId
      });
      if (createRating) {
        return res.status(200).json({
          status: true,
          message: "Rating added successfully",
          data: createRating,
        });
      } else {
        return res.status(400).json({
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
const getAllRatings = async(req, res)=>{
    try {
        const { id } = req.body;
        const getDetail = await Rating.findAll({
            where : {
                id : id
            }, include : [{
                model : User,
                as : "User",
                attributes : ['id', 'name', 'profile_image']
            }]
        })
        if(getDetail){
            return res.status(200).json({
                status : true,
                message : "Show all ratings",
                data : getDetail
            })
        }
        return res.status(400).json({
            status : false,
            message : "Rating not found"
        })
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}
module.exports = {
  addRatingBar,
  getAllRatings
};
