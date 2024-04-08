// controllers/chatController.js
const { Op } = require("sequelize");
const db = require("../../../config/db.config");

const call_details = db.call_details;
const User = db.User;
const WalletSystem = db.wallet_system;
const TransactionHistory = db.transaction_history;

// const addCall = async (req, res) => {
//   try {
//     const {
//       user_id,
//       expert_id,
//       name,
//       start_time,
//       end_time,
//       duration,
//       current_used_bal,
//       device_id,
//       payment_status,
//       transaction_id,
//       payment_method,
//       user_type
//     } = req.body;

//     // Validate request data
//     if (
//       !expert_id ||
//       !name ||
//       !user_id ||
//       !start_time ||
//       !current_used_bal ||
//       !end_time ||
//       !duration
//     ) {
//       return res.status(200).json({
//         status: false,
//         message:
//           "Please provide name, expert_id,duration, user_id, start_time, and end_time.",
//       });
//     }
//     // Fetch expert's per minute rate
//     const expert = await User.findOne({
//       where: {
//         id: expert_id,
//         user_type: {
//           [Op.in]: ["2", "3", "4"],
//         },
//       },
//     });

//     if (!expert) {
//       return res.status(200).json({
//         status: false,
//         message: "Expert not found or not of the required type.",
//       });
//     }

//     const admin_id = 6;
//     // Check for existing wallet system entry
//     const walletSystem = await WalletSystem.findOne({
//       where: { UserId: user_id },
//     });
//     const walletSystem_of_expert = await WalletSystem.findOne({
//       where: { UserId: expert_id },
//     });
//     const walletSystem_of_admin = await WalletSystem.findOne({
//       where: { UserId: admin_id },
//     });
//     if (!walletSystem) {
//       return res
//         .status(200)
//         .json({ status: false, message: "Wallet does not exist" });
//     }
//     if (!walletSystem_of_expert) {
//       return res
//         .status(200)
//         .json({ status: false, message: "Expert_Wallet does not exist" });
//     }
//     if (!walletSystem_of_admin) {
//       return res
//         .status(200)
//         .json({ status: false, message: "Admin_Wallet does not exist" });
//     }

//     // user walletBalance
//     const walletBalance = parseFloat(walletSystem.wallet_amount);
//     // expert walletBalance
//     const walletBalance_of_expert = parseFloat(walletSystem_of_expert.wallet_amount);
//     // admin walletBalance
//     const walletBalance_of_admin = parseFloat(walletSystem_of_admin.wallet_amount);
//     //deduction amount
//     const requestedAmount = parseFloat(current_used_bal);

//     // Check if requested amount exceeds wallet balance
//     if (requestedAmount > walletBalance) {
//       return res
//         .status(200)
//         .json({ status: false, message: "Insufficient wallet balance" });
//     }

//     // Update wallet balance of customer
//     const newBalance = walletBalance - requestedAmount;
//     await WalletSystem.update(
//       { wallet_amount: newBalance },
//       { where: { UserId: user_id } }
//     );

//   // Updating wallet balance of expert
//   const expert_amount = parseFloat(0.9*requestedAmount) ;
//   const newBalance_of_expert = walletBalance_of_expert + expert_amount;
//   await walletBalance_of_expert.update(
//   { wallet_amount: newBalance_of_expert},
//   { where: { UserId: expert_id } }
// );


//     // Update wallet balance of admin
//     const admin_amount = parseFloat(0.1*requestedAmount) ;
//     const newBalance_of_admin = walletBalance_of_admin + admin_amount;
//     await walletSystem_of_admin.update(
//       { wallet_amount: newBalance_of_admin },
//       { where: { UserId: admin_id } }
//     );

// //    // Updating wallet balance of expert
// //    const expert_amount = parseFloat(0.9*requestedAmount) ;
// //    const newBalance_of_expert = walletBalance_of_expert + expert_amount;
// //    await walletBalance_of_expert.update(
// //    { wallet_amount: newBalance_of_expert},
// //    { where: { UserId: expert_id } }
// //  );

//     // Update the call record with duration and deducted amount
//     const result = await call_details.create({
//       UserId: user_id,
//       expert_id: expert_id,
//       senderName: name,
//       call_duration: duration,
//       current_used_bal: requestedAmount, // You might need to adjust this based on your actual logic
//       start_time: start_time,
//       end_time: end_time,
//     });

//      // User transaction history
//      await TransactionHistory.create({
//       UserId: user_id,
//       payment_method,
//       payment_status,
//       transaction_amount: requestedAmount,
//       transaction_id,
//       device_id,
//       status: 1,
//       amount_receiver_id:admin_id,
//       expert_id:expert_id,
//       user_type:user_type
//     });
   
//     // expert transaction history
//     await TransactionHistory.create({
//       UserId: expert_id,
//       payment_method,
//       payment_status,
//       transaction_amount: expert_amount,
//       transaction_id,
//       device_id,
//       status: 1,
//       amount_receiver_id:expert_id,
//       expert_id:expert_id,
//       user_type:user_type,
//       deduct_type : "audio_call"
//     })

//      // admin transaction history
//      await TransactionHistory.create({
//       UserId: admin_id,
//       payment_method,
//       payment_status,
//       transaction_amount: admin_amount,
//       transaction_id,
//       device_id,
//       status: 1,
//       amount_receiver_id:admin_id,
//       expert_id:expert_id,
//       user_type:user_type,
//       deduct_type : "audio_call"
//     })

//     return res.status(200).json({
//       status: true,
//       msg: "Data stored successfully",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Internal server error.",
//     });
//   }
// };


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
      device_id,
      payment_status,
      transaction_id,
      payment_method,
      user_type
    } = req.body;

    // Validate request data
    if (!expert_id || !name || !user_id || !start_time || !current_used_bal || !end_time || !duration) {
      return res.status(200).json({
        status: false,
        message: "Please provide name, expert_id, duration, user_id, start_time, and end_time."
      });
    }

    // Fetch expert's per minute rate
    const expert = await User.findOne({
      where: {
        id: expert_id,
        user_type: {
          [Op.in]: ["2", "3", "4"]
        }
      }
    });

    if (!expert) {
      return res.status(200).json({
        status: false,
        message: "Expert not found or not of the required type."
      });
    }

    const admin_id = 9;

    // Check for existing wallet system entries
    const walletSystem = await WalletSystem.findOne({
      where: { UserId: user_id }
    });
    const walletSystem_of_expert = await WalletSystem.findOne({
      where: { UserId: expert_id }
    });
    const walletSystem_of_admin = await WalletSystem.findOne({
      where: { UserId: admin_id }
    });

    if (!walletSystem) {
      return res.status(200).json({ status: false, message: "Wallet does not exist" });
    }
    if (!walletSystem_of_expert) {
      return res.status(200).json({ status: false, message: "Expert's wallet does not exist" });
    }
    if (!walletSystem_of_admin) {
      return res.status(200).json({ status: false, message: "Admin's wallet does not exist" });
    }

    // Deduction amount
    const requestedAmount = parseFloat(current_used_bal);

    // Check if requested amount exceeds user's wallet balance
    if (requestedAmount > parseFloat(walletSystem.wallet_amount)) {
      return res.status(200).json({ status: false, message: "Insufficient wallet balance" });
    }

    // Update user's wallet balance
    const newBalance = parseFloat(walletSystem.wallet_amount) - requestedAmount;
    await walletSystem.update({ wallet_amount: newBalance });

    // Calculate and update expert's wallet balance
    const expert_amount = parseFloat(0.9 * requestedAmount);
    const newBalance_of_expert = parseFloat(walletSystem_of_expert.wallet_amount) + expert_amount;
    await walletSystem_of_expert.update({ wallet_amount: newBalance_of_expert });

    // Calculate and update admin's wallet balance
    const admin_amount = parseFloat(0.1 * requestedAmount);
    const newBalance_of_admin = parseFloat(walletSystem_of_admin.wallet_amount) + admin_amount;
    await walletSystem_of_admin.update({ wallet_amount: newBalance_of_admin });

    // Create call record
    const result = await call_details.create({
      UserId: user_id,
      expert_id: expert_id,
      senderName: name,
      call_duration: duration,
      current_used_bal: requestedAmount,
      start_time: start_time,
      end_time: end_time
    });

    // Create transaction histories
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
        deduct_type: "audio_call"
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
        user_type: 2,
        deduct_type: "audio_call"
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
        deduct_type: "audio_call"
      }
    ]);

    return res.status(200).json({
      status: true,
      message: "Data stored successfully",
      data: result,
      All_AudioCall_Transaction :allTransaction
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error."
    });
  }
};


module.exports = { addCall };
