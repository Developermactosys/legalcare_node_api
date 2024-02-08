// controllers/callController.js
const db = require("../../../config/db.config");

const CallInQueue = db.call_in_queue;

exports.getCallStatus = async (req, res) => {
  try {
    const { mobile_no } = req.body;
    // Validate mobile_no

    const call = await CallInQueue.findOne({
      where: { mobile_no : mobile_no }
    });

    if (call) {
      res.json({ status: true, message: "Call status list", data: call });
    } else {
      res.json({ status: false, message: "Data does not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
