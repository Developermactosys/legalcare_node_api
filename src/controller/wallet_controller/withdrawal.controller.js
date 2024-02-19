const db = require("../../../config/db.config");

const User = db.User;
const WalletSystem = db.wallet_system;
const TransactionHistory = db.transaction_history;

const withdrawalAmount = async (req, res) => {
  try {
    const { user_id,  amount} = req.query;

  if(!user_id){
    return res.status(400).json({ status: false, message: "Please provide user_id" });
  }

    // Check if user exists
    const userExists = await User.findByPk(user_id);
    if (!userExists) {
      return res.status(404).json({ status: false, message: "User does not exist" });
    }
    function generateTransactionId() {
      // Generate a random string
      const randomString = Math.random().toString(36).substr(2, 10).toUpperCase(); // Example: "ABC123"
    
      // Get current timestamp
      const timestamp = Date.now().toString(); // Example: "1645430912345"
    
      // Combine random string and timestamp to generate transaction ID
      const transactionId = `${randomString}-${timestamp}`; // Example: "ABC123-1645430912345"
    
      return transactionId;
    }
    
    // Example usage
    const transactionId = generateTransactionId();
    
    

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
    await WalletSystem.update({ wallet_amount: newBalance}, { where: { UserId: user_id } });

    // Log transaction history
    await TransactionHistory.create({
      UserId: user_id,
      payment_method:"online",
      transaction_amount: requestedAmount,
      transaction_id : transactionId,
      status: 1
    });

    return res.json({ status: true, message: "Wallet amount updated successfully", wallet_amount: newBalance });
  } catch (error) {
    console.error("Error while deducting amount from wallet:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
    withdrawalAmount
};
