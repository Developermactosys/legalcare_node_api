const db = require("../../../config/db.config");

exports.getChatStatus = async (req, res) => {
  try {
    const { astro_id } = req.body;

    if (!astro_id) {
      return res.status(400).json({
        status: false,
        message: 'Parameter "astro_id" is required',
      });
    }

    const chatStatus = await db.chat_active_status.findOne({
      where: { astro_id: astro_id },
    });

    if (chatStatus) {
      return res.json({
        status: true,
        message: 'Chat status found',
        data: chatStatus,
      });
    } else {
      return res.json({
        status: true,
        message: 'Data not found',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
