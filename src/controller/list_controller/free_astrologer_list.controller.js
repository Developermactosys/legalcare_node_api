// controllers/astrologerController.js

const db = require("../../../config/db.config");

const User = db.User;


exports.freeAstrologerList = async (req, res) => {
    try {
      const { user_id } = req.body;
      // Find the user by ID
      const user = await User.findByPk(user_id);
  
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }
  
      if (user.free_redeem !== 1) {
        return res.status(400).json({ status: false, message: "You have already redeemed your free consultation" });
      }
  
      // Query to fetch free astrologers
      const astrologers = await User.findAll({
        where: {id : user_id},
        // include: [{
        //     model: User,
        //     as : "User",
        //     // attributes: ['name', 'profile_image', 'dob', 'birth_time', 'birth_place'],
        // }],
        order: [['id','DESC']],
        limit: parseInt(req.body.limit),
        offset: parseInt(req.body.offset)
      });
  
      if (astrologers.length > 0) {
        return res.json({ status: true, message: "Success", list: astrologers });
      } else {
        return res.json({ status: false, message: "No data found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  };