const { where } = require("sequelize");
const db = require("../../../config/db.config");
const { Op } = require('sequelize');

const User = db.User;
const WalletSystem = db.wallet_system;
const TransactionHistory = db.transaction_history;
const WithdrawalRequest = db.withdrawal_request;

const withdrawalAmount = async (req, res) => {
  try {
    const { user_id,  amount,user_type} = req.query;

  if(!user_id){
    return res.status(200).json({ status: false, message: "Please provide user_id" });
  }

    // Check if user exists
    const userExists = await User.findByPk(user_id);
    if (!userExists) {
      return res.status(200).json({ status: false, message: "User does not exist" });
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
      return res.status(200).json({ status: false, message: "Wallet does not exist" });
    }

    const walletBalance = parseFloat(walletSystem.wallet_amount);
    const requestedAmount = parseFloat(amount);

    // Check if requested amount exceeds wallet balance
    if (requestedAmount > walletBalance) {
      return res.status(200).json({ status: false, message: "Insufficient wallet balance" });
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
      status: 1,
      user_type:user_type
    });

    return res.json({ status: true, message: "Wallet amount updated successfully", wallet_amount: newBalance });
  } catch (error) {
    console.error("Error while deducting amount from wallet:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};


const create_withdrawal_request= async (req, res) => {
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
      return res.status(200).json({ status: false, message: "Insufficient wallet balance" });
    }

 
    // Create withdrawal request
    await WithdrawalRequest.create({
      request_amount: requestedAmount_1,
      request_date: new Date(),
      UserId :expert_id,
      status: "pending",
    });

    return res.json({ status: true, message: "Withdrawal request created successfully"});
  } catch (error) {
    console.error("Withdrawal Request", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};



const get_withdrawalRequest = async (req, res) => {

  try {
    const { status } = req.query;
    const page = parseInt(req.query.page) || 1; // Current page
    const limit = parseInt(req.query.limit) || 10; // Number of items per page
   
    // Calculate offset for pagination
    const offset = (page - 1) * limit;


    if(status === 'pending'){
    const data = await WithdrawalRequest.findAndCountAll({
      where: { status: status }, // Define the where condition without curly braces
      include: [{
        model: User,
        as: "User",
        attributes: ['id', 'user_type', 'name', 'profile_image']
      },
      
    ],
      limit: limit,
      offset: offset,
      order: [['id', 'DESC']] // You can change the order as needed
    });

    const userIds = data.rows.map((item) => item.UserId);

    // Filter WalletSystem data based on extracted UserIds
    const wallet_amount = await WalletSystem.findAll({
      where: { UserId: userIds }, // Filter by UserIds extracted from WithdrawalRequest data
      attributes: ['UserId', 'wallet_amount']
    });
    const currentPage = page;
    const totalPages = Math.ceil(data.count / limit);
    const totalItems = data.count;

    res.json({
      currentPage: currentPage,
      totalPages: totalPages,
      totalItems: totalItems,
      data: data.rows,
       wallet_amount:wallet_amount
    });
  }else{

    const data = await WithdrawalRequest.findAndCountAll({
      where: {
        status: {
          [Op.or]: ['approved', 'reject'] // Use Op.or to match either 'approved' or 'reject'
        }
      },
      include: [{
        model: User,
        as: "User",
        attributes: ['id', 'user_type', 'name', 'profile_image']
      }],
      limit: limit,
      offset: offset,
      order: [['id', 'DESC']] // You can change the order as needed
    });
    const userIds = data.rows.map((item) => item.UserId);

    // Filter WalletSystem data based on extracted UserIds
    const wallet_amount = await WalletSystem.findAll({
      where: { UserId: userIds }, // Filter by UserIds extracted from WithdrawalRequest data
      attributes: ['UserId', 'wallet_amount']
    });
    const currentPage = page;
    const totalPages = Math.ceil(data.count / limit);
    const totalItems = data.count;

    res.json({
      currentPage: currentPage,
      totalPages: totalPages,
      totalItems: totalItems,
      data: data.rows,
      wallet_amount: wallet_amount

    });
  }

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// const get_withdrawalRequest_by_expert_id = async (req, res) => {
//   try {
//     const { expert_id ,status} = req.query;
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.pageSize) || 10;
//     const offset = (page - 1) * pageSize;
//     const get_withdrawal_request = await WithdrawalRequest.findOne({
//       where: { UserId: expert_id },
    
//       include: [
//         {
//           model: User,
//           as: "User",
//         },
//       ],
//       order: [['createdAt', 'DESC']],
//       offset: offset,
//       limit: pageSize,
//     })
  
   

//     return res.status(200).json({
//       status: true,
//       message: "withdrawal request by expert_id is retrived ",
//       data: get_withdrawal_request,
//       currentPages: page,
//     })

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// }


const get_withdrawalRequest_by_expert_id = async (req, res) => {
  try {
    const { expert_id, status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    let whereCondition = {};
    if (status === 'pending') {
      whereCondition = { status: 'pending', UserId: expert_id };
    } else {
      whereCondition = {
        status: {
          [Op.or]: ['approved', 'reject']
        },
        UserId: expert_id
      };
    }

    const withdrawalRequests = await WithdrawalRequest.findAndCountAll({
      where: whereCondition,
      include: [{
        model: User,
        as: "User",
        attributes: ['id', 'user_type', 'name', 'profile_image']
      }],
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']]
    });

    const currentPage = page;
    const totalPages = Math.ceil(withdrawalRequests.count / pageSize);
    const totalItems = withdrawalRequests.count;

    res.status(200).json({
      status:true,
      currentPage: currentPage,
      totalPages: totalPages,
      totalItems: totalItems,
      data: withdrawalRequests.rows
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};



const update_withdrawal_request_status= async (req, res) => {
  try {
    const { withdrawal_request_id, requested_amount,expert_id ,status, reject_description} = req.body;

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
    const outstanding_amount_balance = parseFloat(walletSystem.outstanding_amount)
    const requestedAmount_1 = parseFloat(requested_amount);

    // Check if requested amount exceeds wallet balance
    if (requestedAmount_1 > walletBalance) {
      return res.status(200).json({ status: false, message: "Insufficient wallet balance" });
    }
    if(status == "is_hold"){
      await WithdrawalRequest.update({status : status},{where:{ id: withdrawal_request_id }})
    }
    if(status == "verification"){
      await WithdrawalRequest.update({status : status}, {where : {id : withdrawal_request_id}})
    }

    if(status == "approved" || status == "realised") {

     // Update wallet balance
     const newBalance = walletBalance - requestedAmount_1;
     await WalletSystem.update({ wallet_amount: newBalance}, { where: { UserId: expert_id } });
    
     // Adding balance in the outstandingAmount
     const outstanding_balance = outstanding_amount_balance + requestedAmount_1;
     await WalletSystem.update({ outstanding_amount: outstanding_balance}, { where: { UserId: expert_id } });

     const user_Type = parseInt(userExists.user_type)
     // Log transaction history
     await TransactionHistory.create({
       UserId: expert_id,
      //  payment_method:payment_method,
       transaction_amount: requestedAmount_1,
      //  transaction_id : transaction_id,
       status: 1,
       user_type:user_Type
     });

     await WithdrawalRequest.update(
      {
         status: status,
          approve_date:Date.now(),
          approve_amount :requestedAmount_1,
          reject_description:reject_description
       },
      { where: { id: withdrawal_request_id } }
    );
    return res.status(200).json({ status: true, message: "Withdrawal request created successfully", wallet_amount: newBalance });


    }else{
     await WithdrawalRequest.update(
      { status: status , approve_date:Date.now(), reject_description:reject_description },
      { where: { id: withdrawal_request_id } }
    );
    return res.status(200).json({ status: false, message: "Withdrawal request rejected"});

  }
    
   
  } catch (error) {
    console.error("Withdrawal Request", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// API for Withdrawable Amount for user

const getPendingWithdrawalAmount = async (req, res) => {
  const { UserId } = req.query;

  try {
      // Find all pending withdrawal requests for the given user
      const pendingWithdrawals = await WithdrawalRequest.findAll({
          where: {
              UserId: UserId,
              status: 'pending' // Assuming 'pending' is the status for pending withdrawals
          }
      });
      if(!pendingWithdrawals){
        return res.status(200).json({
          status : false,
          message : "pending amount not found"
        })
      }
      // Calculate total pending withdrawal amount
      let totalAmount = 0;
      pendingWithdrawals.forEach(withdrawal => {
          totalAmount += withdrawal.request_amount;
      });

      const withdrawnAmounts = await WithdrawalRequest.findAll({
        where: {
            UserId: UserId,
            status: 'approved' // Assuming 'completed' is the status for completed withdrawals
        }
    });
    if(!withdrawnAmounts){
      return res.status(200).json({
        status : false,
        message : "pending amount not found"
      })
    }

    // Calculate total withdrawn amount
    let totalAmount_1 = 0;
    withdrawnAmounts.forEach(withdrawal => {
        totalAmount_1 += withdrawal.approve_amount;
    });

    const withdrawableAmounts = await WithdrawalRequest.findAll({
      where: {
          UserId: UserId,
          status: 'reject' // Assuming 'completed' is the status for completed withdrawals
      }
  });

  if(!withdrawableAmounts){
    return res.status(200).json({
      status : false,
      message : "pending amount not found"
    })
  }
  // Calculate total withdrawn amount
  let totalAmount_2 = 0;
  withdrawableAmounts.forEach(withdrawal => {
      totalAmount_2 += withdrawal.request_amount;
  });

    const user = await User.findByPk(UserId);
    if (!user) {
      return res.status(200).json({ status: false, message: "User not found" });
    }

    const walletAmount = await WalletSystem.sum('wallet_amount', { where: { UserId : UserId } });
    
  if(!walletAmount){
    return res.status(200).json({
      status : false,
      message : "wallet amount not found"
    })
  }
      return res.status(200).json({
          status: true,
          message: "Total  withdrawal amount list",
          data: {
              userId: UserId,
              totalAmountForPending: totalAmount || 0,
              totalAmountForApproved:totalAmount_1 || 0,
              totalAmountReject:totalAmount_2 || 0,
              totalAmount : walletAmount || 0

          }
      });
  } catch (error) {
      return res.status(500).json({
          status: false,
          message: error.message
      });
  }
}

module.exports = {
    withdrawalAmount,
    create_withdrawal_request,
    get_withdrawalRequest_by_expert_id,
    get_withdrawalRequest,
    update_withdrawal_request_status,
    getPendingWithdrawalAmount
};
