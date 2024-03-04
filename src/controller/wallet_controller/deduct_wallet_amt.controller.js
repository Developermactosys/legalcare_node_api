const db = require("../../../config/db.config");

const User = db.User;
const WalletSystem = db.wallet_system;
const TransactionHistory = db.transaction_history;

const deductWalletAmount = async (req, res) => {
  try {
    const { user_id, payment_method, amount, transaction_id, device_id, payment_status,expert_id } = req.body;

    // Check for empty or undefined fields
    const isEmptyKey = Object.values(req.body).some(value => value === '' || value === null || value === undefined);
    if (isEmptyKey) {
      return res.status(400).json({ error: "Please do not leave empty or undefined fields" });
    }

    // Check if user exists
    const userExists = await User.findByPk(user_id);
    if (!userExists) {
      return res.status(404).json({ status: false, message: "User does not exist" });
    }

    // Check for existing wallet system entry
    const walletSystem = await WalletSystem.findOne({ where: { UserId: user_id } });
    if (!walletSystem) {
      return res.status(404).json({ status: false, message: "Wallet does not exist" });
    }

    const walletBalance = parseFloat(walletSystem.wallet_amount);
    const requestedAmount = parseFloat(amount);

    // Check if requested amount exceeds wallet balance
    if (requestedAmount > walletBalance) {
      return res.status(400).json({ status: false, message: "Insufficient wallet balance" });
    }

    // Update wallet balance
    const newBalance = walletBalance - requestedAmount;
    await WalletSystem.update({ wallet_amount: newBalance, device_id }, { where: { UserId: user_id } });

    // Log transaction history
    await TransactionHistory.create({
      UserId: user_id,
      payment_method,
      payment_status,
      transaction_amount: requestedAmount,
      transaction_id,
      device_id,
      status: 1
    });

    const walletSystem_of_expert  = await WalletSystem.findOne({ where: { UserId: expert_id } });
    const walletSystem_of_admin = await WalletSystem.findOne({ where: { UserId: expert_id } });

    return res.json({ status: true, message: "Wallet amount updated successfully", wallet_amount: newBalance });
  } catch (error) {
    console.error("Error while deducting amount from wallet:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  deductWalletAmount
};
