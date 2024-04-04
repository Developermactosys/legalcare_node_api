const db = require("../../../config/db.config");

const User = db.User;
const WalletSystem = db.wallet_system;
const TransactionHistory = db.transaction_history;
const WithdrawalRequest = db.withdrawal_request;

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


const withdrawal_request= async (req, res) => {
  try {
    const { expert_id, requested_amount } = req.body;

    if (!expert_id) {
      return res.status(200).json({ status: false, message: "Please provide expert_id" });
    }

    // Check if user exists
    const userExists = await User.findByPk(expert_id);
    if (!userExists) {
      return res.status(200).json({ status: false, message: "Expert does not exist" });
    }

   
    // Check for existing wallet system entry
    const walletSystem = await WalletSystem.findOne({ where: { UserId: expert_id } });
    if (!walletSystem) {
      return res.status(200).json({ status: false, message: "Wallet does not exist" });
    }

    const walletBalance = parseFloat(walletSystem.wallet_amount);
    const requestedAmount_1 = parseFloat(requested_amount);

    // Check if requested amount exceeds wallet balance
    if (requestedAmount_1 > walletBalance) {
      return res.status(400).json({ status: false, message: "Insufficient wallet balance" });
    }

 
    // Create withdrawal request
    await WithdrawalRequest.create({
      request_amount: requestedAmount_1,
      request_date: new Date(),
      status: "pending",
    });

    return res.json({ status: true, message: "Withdrawal request created successfully", wallet_amount: newBalance });
  } catch (error) {
    console.error("Withdrawal Request", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};



const get_withdrawalRequest = async (req, res) => {

  try {
    const page = parseInt(req.query.page) || 1; // Current page
    const limit = parseInt(req.query.limit) || 10; // Number of items per page

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Query to get paginated data
    const data = await WithdrawalRequest.findAndCountAll({
      include:[{
        model: User,
        as: "User",
        attributes:['id','user_type','name','profile_image']
      }],
      limit: limit,
      offset: offset,
      order: [['id', 'DESC']] // You can change the order as needed
    });

    const currentPage = page;
    const totalPages = Math.ceil(data.count / limit);
    const totalItems = data.count;

    res.json({
      currentPage: currentPage,
      totalPages: totalPages,
      totalItems: totalItems,
      data: data.rows
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const update_withdrawal_request_status= async (req, res) => {
  try {
    const { withdrawal_request_id, requested_amount,expert_id ,status, transaction_id } = req.body;

    if (!withdrawal_request_id) {
      return res.status(200).json({ status: false, message: "Please provide withdrawal_request_id" });
    }

    // Check if user exists
    const userExists = await User.findByPk(expert_id);
    if (!userExists) {
      return res.status(200).json({ status: false, message: "Expert does not exist" });
    }

   
    // Check for existing wallet system entry
    const walletSystem = await WalletSystem.findOne({ where: { UserId: expert_id } });
    if (!walletSystem) {
      return res.status(200).json({ status: false, message: "Wallet does not exist" });
    }

    const walletBalance = parseFloat(walletSystem.wallet_amount);
    const requestedAmount_1 = parseFloat(requested_amount);

    // Check if requested amount exceeds wallet balance
    if (requestedAmount_1 > walletBalance) {
      return res.status(400).json({ status: false, message: "Insufficient wallet balance" });
    }

    // function generateTransactionId() {
    //   // Generate a random string
    //   const randomString = Math.random().toString(36).substr(2, 10).toUpperCase(); // Example: "ABC123"
    
    //   // Get current timestamp
    //   const timestamp = Date.now().toString(); // Example: "1645430912345"
    
    //   // Combine random string and timestamp to generate transaction ID
    //   const transactionId = `${randomString}-${timestamp}`; // Example: "ABC123-1645430912345"
    
    //   return transactionId;
    // }
    
    // // Example usage
    // const transactionId = generateTransactionId();

     // Update wallet balance
     const newBalance = walletBalance - requestedAmount_1;
     await WalletSystem.update({ wallet_amount: newBalance}, { where: { UserId: expert_id } });
 
     // Log transaction history
     await TransactionHistory.create({
       UserId: expert_id,
       payment_method:payment_method,
       transaction_amount: requestedAmount_1,
       transaction_id : transaction_id,
       status: 1
     });
 
    // Create withdrawal request
    await WithdrawalRequest.update({
    
      status:status,
    });

    return res.json({ status: true, message: "Withdrawal request created successfully", wallet_amount: newBalance });
  } catch (error) {
    console.error("Withdrawal Request", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
    withdrawalAmount,
    withdrawal_request,
    get_withdrawalRequest
};
