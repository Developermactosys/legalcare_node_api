// controllers/view_wallet_balance.Controller.js
const db = require("../../../config/db.config");

const User = db.User
const Wallet = db.wallet_system


exports.viewWalletBalance = async (req, res) => {
    try {
      const { user_id } = req.body;
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }
  
      const walletAmount = await Wallet.sum('wallet_amount', { where: { UserId : user_id } });
      const data = {
        status: true,
        Amount: walletAmount || 0,
        message: walletAmount ? "All Wallet Amount data" : "No data found found"
      };
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  };