
const db = require("../../../config/db.config");

const User = db.User;
const WalletSystem = db.wallet_system;
const TransactionHistory = db.transaction_history;



const addWalletAmount = async (req, res) => {

  try {
    const { user_id, payment_method, wallet_amount, transaction_id, device_id, payment_status ,user_type,deduct_type} = req.body;

    const isEmptykey = Object.keys(req.body).some(key => {
      const value = req.body[key]
      return value === '' || value === null || value === undefined;
    })
    if (isEmptykey) {
      return res.status(200).json({ error: "please do not give empty or undefined or null fileds" })
    }

    // Check if user exists
    const userExists = await User.findByPk(user_id);
    if (!userExists) {
      return res.status(200).json({ status: false, message: "User does not exist" });
    }

    // Check for existing wallet system entry
    const walletSystem = await WalletSystem.findOne({ where: { UserId: user_id } });

    if (walletSystem) {
      // Wallet exists, update it
      const newBalance = parseFloat(wallet_amount) + parseFloat(walletSystem.wallet_amount);
      await WalletSystem.update({ wallet_amount: newBalance }, { where: { UserId: user_id } });

      // Log transaction history
      await TransactionHistory.create({
        UserId: user_id,
        payment_method,
        payment_status,
        transaction_amount: wallet_amount,
        transaction_id,
        device_id,
        status: 1,
        user_type:user_type,
        deduct_type : deduct_type
      });

      // Assuming InserIntoNotification is a function you've defined elsewhere for notifications
      // InserIntoNotification(user_id, `${wallet_amount} Rs Recharge Successfully`, "recharge", "Recharge Done");

      return res.json({ status: true, wallet_amount: newBalance, message: "Your Wallet amount updated successfully" });
    } else {
      // No wallet entry exists, create it
      await WalletSystem.create({
        UserId: user_id,
        wallet_amount,
        // Assuming you might want to store additional fields like device_id, etc.
      });

      // Log transaction history
      await TransactionHistory.create({
        UserId: user_id,
        payment_method,
        payment_status,
        wallet_amount,
        transaction_id,
        status: 1,
        user_type:user_type,
        deduct_type :deduct_type
      });

      // InserIntoNotification(user_id, `${wallet_amount} Rs Recharge Successfully`, "recharge", "Recharge Done");

      return res.json({ status: true, wallet_amount, message: "Your Wallet amount added successfully" });
    }
  } catch (error) {
    console.error("Error adding wallet amount:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Recharge History

const transaction_details = async (req, res) => {
  const { user_id, user_type } = req.query;
  try {
    if(!user_id){
      return res.status(400).json({ status: false, message: "Please provide user_id" })
    }
    if(!user_type){
      return res.status(400).json({ status: false, message: "Please provide user_type" })
    }
    const transactionData = await TransactionHistory.findAll({
      where: {
        UserId: user_id, 
      },
      order: [['id', 'DESC']],
    })
    if (transactionData) {
      return res.status(200).json({
        status: true,
        message: "Show data successfully",
        list: transactionData
      })
    }
    else {
      return res.status(400).json({ status: false, message: "User does not exist" })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal server error" })
  }
}

module.exports = {
  addWalletAmount,
  transaction_details
};
