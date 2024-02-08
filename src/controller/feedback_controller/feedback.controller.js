// controllers/feedbackController.js
const db = require("../../../config/db.config");

const User = db.User;
const Feedback = db.feedback;

exports.feedbackController = async (req, res) => {
  try {
    // Check if the user exists
    const { user_id } = req.body;
    const checkUser = await User.findByPk(user_id);

    if (checkUser) {
      // Create feedback record
      const feedback = await Feedback.create({
        user_id: req.body.user_id,
        name: req.body.name,
        email: req.body.email,
        phone_no: req.body.phone,
        review: req.body.message,
        rating: req.body.user_rating,
        date: new Date(),
      });

      return res.status(200).json({
        status: true,
        user_id: feedback.id,
        user_name: feedback.name,
        email: feedback.email,
        rply: feedback.review,
        message: 'Your Feedback sent successfully',
      });
    } else {
      return res.status(404).json({
        status: false,
        data: '',
        message: 'User not found',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      status: false,
      data: '',
      message: 'Something went wrong',
    });
  }
};
