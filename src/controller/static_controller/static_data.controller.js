const db = require("../../../config/db.config");

exports.getStaticData = async (req, res) => {
    try {
      const { key } = req.body; 
  
      if (!key) {
        return res.status(400).json({
          status: false,
          message: 'Parameter "key" is required',
        });
      }
  
      const data = await db.static_data.findAll({
        attributes: ['value'],
        where: { keys: key },
      });
  
      return res.json({
        status: true,
        message: 'Data retrieved successfully',
        data: data,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };