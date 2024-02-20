// controllers/userController.js
const  db  = require('../../../config/db.config');
const User = db.User;

exports.addFollowUsers = async (req, res) => {
  const { provider_id } = req.body;
  try {
    const user = await User.findByPk(provider_id);

    if (!user) {
      return res.json({
        status: false,
        message: 'User not found',
      });
    }

    const newCount = user.follow_count + 1;
    await user.update({ follow_count: newCount });

    return res.json({
      status: true,
      message: 'Count updated',
      new_count: newCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
