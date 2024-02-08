
const db = require("../../../config/db.config");

const User = db.User;
const WalletSystem = db.wallet_system;
const TransactionHistory = db.trancation_histroy;



const addWalletAmount = async (req, res) => {

  try {
    const { user_id, payment_method, wallet_amount, trancation_id, device_id, payment_status } = req.body;

    const isEmptykey = Object.keys(req.body).some(key => {
      const value = req.body[key]
      return value === '' || value === null || value === undefined;
  })
  if (isEmptykey) {
      return res.status(400).json({ error: "please do not give empty or undefined or null fileds" })
  }

    // Check if user exists
    const userExists = await User.findByPk(user_id);
    if (!userExists) {
      return res.status(404).json({ status: false, message: "User does not exist" });
    }

    // Check for existing wallet system entry
    const walletSystem = await WalletSystem.findOne({ where: { UserId :user_id } });

    if (walletSystem) {
      // Wallet exists, update it
      const newBalance = parseFloat(wallet_amount) + parseFloat(walletSystem.wallet_amount);
      await WalletSystem.update({ wallet_amount: newBalance }, { where: {UserId: user_id } });

      // Log transaction history
      await TransactionHistory.create({
        UserId: user_id,
        payment_method,
        payment_status,
        wallet_amount,
        trancation_id,
        status: 1
      });

      // Assuming InserIntoNotification is a function you've defined elsewhere for notifications
      // InserIntoNotification(user_id, `${wallet_amount} Rs Recharge Successfully`, "recharge", "Recharge Done");

      return res.json({ status: true, wallet_amount: newBalance, message: "Your Wallet amount updated successfully" });
    } else {
      // No wallet entry exists, create it
      await WalletSystem.create({
        UserId :user_id,
        wallet_amount,
        // Assuming you might want to store additional fields like device_id, etc.
      });

      // Log transaction history
      await TransactionHistory.create({
        UserId : user_id,
        payment_method,
        payment_status,
        wallet_amount,
        trancation_id,
        status: 1
      });

      // InserIntoNotification(user_id, `${wallet_amount} Rs Recharge Successfully`, "recharge", "Recharge Done");

      return res.json({ status: true, wallet_amount, message: "Your Wallet amount added successfully" });
    }
  } catch (error) {
    console.error("Error adding wallet amount:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  addWalletAmount
};
