const db = require('../../../config/db.config')
const {Sequelize,Op} = require("sequelize");
const  sequelize  = require("sequelize");
const video_call_details = db.video
const WalletSystem = db.wallet_system
const TransactionHistory = db.transaction_history
const User = db.User;


// // API for add video call
// exports.add_video_call = async (req, res) => {
//   try {
//     const {
//       user_id,
//       expert_id,
//       name,
//       start_time,
//       end_time,
//       duration,
//       current_used_bal,
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
//           [Op.in]: ["2", "3" , "4"],
//         },
//       },
//     });

//     if (!expert) {
//       return res.status(200).json({
//         status: false,
//         message: "Expert not found or not of the required type.",
//       });
//     }

//     const admin_id = 9;
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
//         .status(404)
//         .json({ status: false, message: "Wallet does not exist" });
//     }
//     // if (!walletSystem_of_expert) {
//     //   return res
//     //     .status(404)
//     //     .json({ status: false, message: "Expert_Wallet does not exist" });
//     // }
//     if (!walletSystem_of_admin) {
//       return res
//         .status(404)
//         .json({ status: false, message: "Admin_Wallet does not exist" });
//     }

//     const walletBalance = parseFloat(walletSystem.wallet_amount);
//     const walletBalance_of_admin = parseFloat(
//       walletSystem_of_admin.wallet_amount
//     );
//     const requestedAmount = parseFloat(current_used_bal);

//     // Check if requested amount exceeds wallet balance
//     if (requestedAmount > walletBalance) {
//       return res
//         .status(400)
//         .json({ status: false, message: "Insufficient wallet balance" });
//     }

//     // Update wallet balance of customer
//     const newBalance = walletBalance - requestedAmount;
//     await WalletSystem.update(
//       { wallet_amount: newBalance, },
//       { where: { UserId: user_id } }
//     );

//     // Update wallet balance of admin
//     const newBalance_of_admin = walletBalance_of_admin + requestedAmount;
//     await walletSystem_of_admin.update(
//       { wallet_amount: newBalance_of_admin },
//       { where: { UserId: admin_id } }
//     );

//     // const expert_per_minute_rate = expert.per_minute;

//     // // Calculate the duration in minutes (assuming duration is in minutes)
//     // const start = new Date(start_time);
//     // const end = new Date(end_time);
//     // const callDuration = Math.round((end - start) / (1000 * 60)); // Duration in minutes

//     // // Calculate the amount based on the duration and expert's rate
//     // const amountDeducted = callDuration * expert_per_minute_rate;

//     // Update the call record with duration and deducted amount
//     const result = await video_call_details.create({
//       UserId: user_id,
//       expert_id: expert_id,
//       senderName: name,
//       video_call_duration: duration,
//       current_used_bal: current_used_bal, // You might need to adjust this based on your actual logic
//       start_time: start_time,
//       end_time: end_time,
//     });

//     return res.status(200).json({
//       status: true,
//       msg: "video Data stored successfully",
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

exports.add_video_call = async (req, res) => {
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

    const admin_id = 6;

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
    const result = await video_call_details.create({
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
        deduct_type: "video_call"
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
        deduct_type: "video_call"
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
        deduct_type: "video_call"
      }
    ]);

    return res.status(200).json({
      status: true,
      message: "Data stored successfully",
      data: result,
      All_videoCall_Transaction :allTransaction
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error."
    });
  }
};

// API for view video details
exports.view_video_details=  async (req, res) => {
    try {
      const { user_id, expert_id } = req.body;

      const chatHistory = await video_call_details.findAll({
        where: {
          [sequelize.Op.or]: [
            { UserId: expert_id, expert_id: user_id },
            { UserId: user_id, expert_id: expert_id },
          ],
        },
      });

      if (chatHistory.length > 0) {
        return res.status(200).json({
          status: true,
          message: 'User and Expert details Found',
          data: chatHistory,
        });
      } else {
        return res.status(404).json({
          status: false,
          data: null,
          message: 'No Data Found',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        status: false,
        data: null,
        message: 'Internal Server Error',
      });
    }
  }

  
exports.videoHistoryController = async (req, res) => {
    try {
        const { user_id, user_type } = req.body;
        let callDetails;
        let expert_Id
        let expert_data = []
        let final_data = []
        let response 

        if (user_type === "2") {
            callDetails = await video_call_details.findAll({
                where: { expert_id: user_id },
                include: [
                    {
                        model: User,
                        as: "User"
                    },
                ],
                order: [['id', 'DESC']],
            });
             response = {
              status: true,
              message: 'Call History retrieved successfully',
              data: callDetails,
          };
          return res.status(200).json(response);

        } else if (user_type === "1") {
            callDetails = await video_call_details.findAll({
                where: { UserId: user_id },
                // include: [
                //     {
                //         model: User,
                //         as: "User",
                //         where: { id: sequelize.col('video_call_details.expert_id') }
                //         // where: sequelize.literal('User.id = video_call_details.expert_id')
                //     },
                // ],
                order: [['id', 'DESC']],

            });

    for(let i =0; i<callDetails.length; i++){
      expert_Id = callDetails[i].expert_id;
      const  ex_data = await User.findByPk(expert_Id)
      expert_data.push({data :callDetails[i], expert : ex_data})

      // final_data.push()
    }
        }

         response = {
            status: true,
            message: 'Call History retrieved successfully',
            data: expert_data,
        };
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
        });
    }
};

exports.getVideoStatus = async (req, res) => {
    try {
      const { mobile_no } = req.body;
      // Validate mobile_no
  
      const call = await CallInQueue.findOne({
        where: { mobile_no : mobile_no }
      });
  
      if (call) {
        res.json({ status: true, message: "Call status list", data: call });
      } else {
        res.json({ status: false, message: "Data does not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  };
  