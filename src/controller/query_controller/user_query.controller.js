// controllers/queryController.js

const db = require("../../../config/db.config");
const { v4: uuidv4 } = require('uuid'); // Import uuidv4 from uuid package

const AdminQuery = db.admin_query;

// exports.userQueries = async (req, res) => {
//   try {
//     const { user_id } = req.query;

//     // Validate user_id
//     if (!user_id) {
//       return res.status(400).json({ status: false, message: "Please provide a user ID" });
//     }

//     // Fetch user queries
//     const queries = await AdminQuery.findAll({
//       where: { Userid: user_id },
//       order: [['id', 'DESC']]
//     });

//     return res.json({ status: true, message: "User queries fetched successfully", data: queries });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ status: false, message: "Internal Server Error" });
//   }
// };



exports.userQueries = async (req, res) => {
  try {
    const { user_id } = req.query;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ status: false, message: "Please provide a user ID" });
    }

    // Fetch user queries
    const queries = await AdminQuery.findAll({
      where: { Userid: user_id },
      order: [['id', 'DESC']]
    });

    // Generate ticketId for each query
    queries.forEach(query => {
      query.ticketId = uuidv4(); // Assign a new UUID as the ticketId for each query
    });

    return res.json({ status: true, message: "User queries fetched successfully", data: queries });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};
