const db = require("../../../config/db.config");

const User = db.User;
const WalletSystem = db.wallet_system;
const TransactionHistory = db.transaction_history;
const admin_setting = db.admin_setting;

const deductWalletAmount = async (req, res) => {
  try {
    const {
      user_id,
      payment_method,
      amount,
      transaction_id,
      device_id,
      payment_status,
      expert_id,
      // user_type,
      deduct_type,
      description
    } = req.body;

    // Check for empty or undefined fields
    const isEmptyKey = Object.values(req.body).some(
      (value) => value === "" || value === null || value === undefined
    );
    if (isEmptyKey) {
      return res
        .status(200)
        .json({ error: "Please do not leave empty or undefined fields" });
    }

    // Check if user exists
    const userExists = await User.findByPk(user_id);


    if (!userExists) {
      return res
        .status(200)
        .json({ status: false, message: "User does not exist" });
    }

     // Check if expert exists
     const expertExists = await User.findByPk(expert_id);

    const get_user_type = expertExists.user_type

     if (!expertExists) {
       return res
         .status(200)
         .json({ status: false, message: "Expert does not exist" });
     }

     const find_admin_percentage = await admin_setting.findByPk(12)
     const admin_booking_percentage = parseFloat(find_admin_percentage.admin_per_booking / 100)

    const admin_id = 9;
    // Check for existing wallet system entry
    const walletSystem = await WalletSystem.findOne({
      where: { UserId: user_id },
    });

    const walletSystem_of_expert = await WalletSystem.findOne({
      where: { UserId: expert_id },
    });
    const walletSystem_of_admin = await WalletSystem.findOne({
      where: { UserId: admin_id },
    });

    // Wallet of User
    if (!walletSystem) {
      return res
        .status(200)
        .json({ status: false, message: "Wallet does not exist" });
    }

    let creating_wallet_of_expert 

    if (!walletSystem_of_expert) {

      // No wallet entry exists, create it
      creating_wallet_of_expert = await WalletSystem.create({
        UserId: expert_id,
        wallet_amount:0,
        // Assuming you might want to store additional fields like device_id, etc.
      });
    }
    const new_walletSystem_of_expert = await WalletSystem.findOne({
      where: { UserId: expert_id },
    });

    if (!walletSystem_of_admin) {
      return res
        .status(200)
        .json({ status: false, message: "Admin_Wallet does not exist" });
    }

    // User wallet balance
    const walletBalance = parseFloat(walletSystem.wallet_amount);

    const wallet_balance_of_admin = parseFloat(walletSystem_of_admin.wallet_amount);

    const wallet_balance_of_expert = parseFloat(new_walletSystem_of_expert.wallet_amount);


    const requestedAmount = parseFloat(amount);

    // Check if requested amount exceeds wallet balance
    if (requestedAmount > walletBalance) {
      return res
        .status(200)
        .json({ status: false, message: "Insufficient wallet balance" });
    }

    // Update wallet balance of customer
    const newBalance = walletBalance - requestedAmount;
    await WalletSystem.update(
      { wallet_amount: newBalance, device_id },
      { where: { UserId: user_id } }
    );

    // // Update wallet balance of admin
    // const newBalance_of_admin = walletBalance + requestedAmount;
    // await walletSystem_of_admin.update(
    //   { wallet_amount: newBalance_of_admin, device_id },
    //   { where: { UserId: admin_id } }
    // );

    // Updating wallet balance of expert
    const expert_percentage = parseFloat( 1- admin_booking_percentage)
    const expert_amount = parseFloat(expert_percentage * requestedAmount);
    const newBalance_of_expert = wallet_balance_of_expert + expert_amount;
    await new_walletSystem_of_expert.update(
      { wallet_amount: newBalance_of_expert, device_id },
      { where: { UserId: expert_id } }
    );

    // Update wallet balance of admin
    const admin_amount = parseFloat(admin_booking_percentage * requestedAmount);
    const newBalance_of_admin = wallet_balance_of_admin + admin_amount;
    await walletSystem_of_admin.update(
      { wallet_amount: newBalance_of_admin, device_id },
      { where: { UserId: admin_id } }
    );

    // // Log transaction history
    // await TransactionHistory.create({
    //   UserId: user_id,
    //   payment_method,
    //   payment_status,
    //   transaction_amount: requestedAmount,
    //   transaction_id,
    //   device_id,
    //   status: 1,
    //   user_type:user_type,
    //   deduct_type:deduct_type,
    //   description:description
    // });
    const allTransaction = await TransactionHistory.bulkCreate([
      {
        UserId: user_id,
        payment_method,
        payment_status,
        transaction_amount: requestedAmount,
        transaction_id,
        device_id,
        status: 1,
        amount_receiver_id: admin_id,
        expert_id: expert_id,
        user_type: 1,
        deduct_type:deduct_type,
       description:description
      },
      {
        UserId: expert_id,
        payment_method,
        payment_status,
        transaction_amount: expert_amount,
        transaction_id,
        device_id,
        status: 1,
        amount_receiver_id: expert_id,
        expert_id: expert_id,
        user_type: get_user_type,
        deduct_type:deduct_type,
        description:description
      },
      {
        UserId: admin_id,
        payment_method,
        payment_status,
        transaction_amount: admin_amount,
        transaction_id,
        device_id,
        status: 1,
        amount_receiver_id: admin_id,
        expert_id: expert_id,
        user_type: 0,
        deduct_type:deduct_type,
        description:description
      }
    ]);

    return res.status(200).json({
      status: true,
      message: "Wallet amount updated successfully",
      wallet_amount: newBalance,
    });
  } catch (error) {
    console.error("Error while deducting amount from wallet:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  deductWalletAmount
};
