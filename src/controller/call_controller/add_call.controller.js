// controllers/chatController.js
const { Op } = require("sequelize");
const db = require("../../../config/db.config");

const call_details = db.call_details;
const User = db.User;
const WalletSystem = db.wallet_system;
const TransactionHistory = db.trancation_histroy;

const addCall = async (req, res) => {
  try {
    const {
      user_id,
      expert_id,
      name,
      start_time,
      end_time,
      duration,
      current_used_bal,
    } = req.body;

    // Validate request data
    if (
      !expert_id ||
      !name ||
      !user_id ||
      !start_time ||
      !current_used_bal ||
      !end_time ||
      !duration
    ) {
      return res.status(400).json({
        status: false,
        message:
          "Please provide name, expert_id,duration, user_id, start_time, and end_time.",
      });
    }
    // Fetch expert's per minute rate
    const expert = await User.findOne({
      where: {
        id: expert_id,
        user_type: {
          [Op.in]: ["2", "3", "4"],
        },
      },
    });

    if (!expert) {
      return res.status(404).json({
        status: false,
        message: "Expert not found or not of the required type.",
      });
    }

    const admin_id = 9;
    // Check for existing wallet system entry
    const walletSystem = await WalletSystem.findOne({
      where: { UserId: user_id },
    });
    // const walletSystem_of_expert = await WalletSystem.findOne({
    //   where: { UserId: expert_id },
    // });
    const walletSystem_of_admin = await WalletSystem.findOne({
      where: { UserId: admin_id },
    });
    if (!walletSystem) {
      return res
        .status(404)
        .json({ status: false, message: "Wallet does not exist" });
    }
    // if (!walletSystem_of_expert) {
    //   return res
    //     .status(404)
    //     .json({ status: false, message: "Expert_Wallet does not exist" });
    // }
    if (!walletSystem_of_admin) {
      return res
        .status(404)
        .json({ status: false, message: "Admin_Wallet does not exist" });
    }

    const walletBalance = parseFloat(walletSystem.wallet_amount);
    const walletBalance_of_admin = parseFloat(walletSystem_of_admin.wallet_amount);
    const requestedAmount = parseFloat(current_used_bal);

    // Check if requested amount exceeds wallet balance
    if (requestedAmount > walletBalance) {
      return res
        .status(400)
        .json({ status: false, message: "Insufficient wallet balance" });
    }

    // Update wallet balance of customer
    const newBalance = walletBalance - requestedAmount;
    await WalletSystem.update(
      { wallet_amount: newBalance },
      { where: { UserId: user_id } }
    );

    // Update wallet balance of admin
    const newBalance_of_admin = walletBalance_of_admin + requestedAmount;
    await walletSystem_of_admin.update(
      { wallet_amount: newBalance_of_admin },
      { where: { UserId: admin_id } }
    );

    // Update the call record with duration and deducted amount
    const result = await call_details.create({
      UserId: user_id,
      expert_id: expert_id,
      senderName: name,
      call_duration: duration,
      current_used_bal: requestedAmount, // You might need to adjust this based on your actual logic
      start_time: start_time,
      end_time: end_time,
    });

     // Log transaction history
     await TransactionHistory.create({
      UserId: user_id,
      payment_method,
      payment_status,
      transaction_amount: requestedAmount,
      transaction_id,
      device_id,
      status: 1,
      amount_receiver_id:admin_id,
      expert_id:expert_id
    });

    return res.status(200).json({
      status: true,
      msg: "Data stored successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

module.exports = { addCall };
