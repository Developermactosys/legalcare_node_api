// const { where } = require("sequelize");
const { Sequelize, where } = require("sequelize");
const db = require("../../../config/db.config");
const Booking_details = db.booking_detail;
const service = db.service;
const User = db.User;
const wallet_system = db.wallet_system
const Notification = db.notification;
const expert_service = db.expert_service
const admin_setting = db.admin_setting;
const TransactionHistory = db.transaction_history;
// exports.Add_Booking = async (req, res) => {
//   try {
//     const { serviceId, discounted_amount, GST, user_id } = req.body;

//     const isEmptykey = Object.keys(req.body).some((key) => {
//       const value = req.body[key];
//       return value === "" || value === null || value === undefined;
//     });
//     if (isEmptykey) {
//       return res.status(400).json({ error: "please do not give empty fileds" });
//     }

//     const findService = await service.findByPk(serviceId)
//     const add_booking = await Booking_details.create(req.body);

//     add_booking.serviceId = serviceId;
//     add_booking.discounted_amount = discounted_amount;
//     add_booking.GST = GST;
//     add_booking.UserId = user_id;
//     add_booking.expert_id = findService.UserId;

//     await add_booking.save();

//     return res.status(200).json({
//       status: true,
//       message: "Booked successfully",
//       data: add_booking,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const FCM = require('fcm-node');
const serverKey = process.env.SERVER_KEY_HERE;
const fcm = new FCM(serverKey);


// exports.Add_Booking = async (req, res) => {
//   try {
//     const { serviceId, discounted_amount, GST, user_id ,time} = req.body;

//     const isEmptykey = Object.keys(req.body).some((key) => {
//       const value = req.body[key];
//       return value === "" || value === null || value === undefined;
//     });
//     if (isEmptykey) {
//       return res.status(400).json({ error: "please do not give empty fields" });
//     }
//     const add_booking = await Booking_details.create(req.body);

//     const find_service = await service.findByPk(serviceId)
//     const service_name = find_service.serviceName

//     add_booking.serviceId = serviceId;
//     add_booking.discounted_amount = discounted_amount;
//     add_booking.GST = GST;
//     add_booking.UserId = user_id;
//     add_booking.expert_id = find_service.UserId;
//     add_booking.in_progress_time = time;

//     await add_booking.save();

//     const expert_id = find_service.UserId

//     const user = await User.findByPk(user_id)
//     const user_name =  user.name
//     const expert = await User.findByPk(expert_id) 
//     const expert_name = expert.name

//     var message = {
//       to: expert.device_id, // Assuming the user model has a device_id field
//       notification: {
//         title: `Booking Confirmation`,
//         body: `Dear ${expert_name} you have received a service request from ${user_name} for ${service_name} with Booking ID ${add_booking.id}.`,
//       },

//     }

//     await Notification.create({
//       message: message.notification.body,
//       type: " Booking ",
//       UserId : expert.id
//     });

//     fcm.send(message, function(err, response) {
//       if (err) {
//         console.error("Error:", err.message);
//         return res.status(400).json({ success: false, message: "Failed to send notification" });
//       } else {
//         console.log("Successfully sent with response: ", response);
//         return res.status(200).json({
//           status: true,
//           message: "Booked successfully and notification sent",
//           data: add_booking,
//         });
//       }
//     });
// } catch (error) {
//   console.error(error);
//   return res.status(500).json({ error: "Internal Server Error" });
// }
// };

// Function to generate booking ID


exports.Add_Booking = async (req, res) => {
  try {
    const { serviceId, discounted_amount, GST, user_id, time, expert_id } = req.body;

    const isEmptykey = Object.keys(req.body).some((key) => {
      const value = req.body[key];
      return value === "" || value === null || value === undefined;
    });
    if (isEmptykey) {
      return res.status(400).json({ error: "please do not give empty fields" });
    }
    const add_booking = await Booking_details.create(req.body);
    function generateBookingID() {
      // Get the current date
      const currentDate = new Date();

      // Extract year, month, and day components
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding leading zero if necessary
      const day = currentDate.getDate().toString().padStart(2, '0'); // Adding leading zero if necessary

      // Get the sequential number (you can replace this with your own logic to generate sequential numbers)
      const sequentialNumber = add_booking.id; // You need to implement this function

      // Format the booking ID
      const bookingID = `LL${day}${month}${year}${sequentialNumber}`;

      return bookingID;
    }

    const bookingID = generateBookingID()
    const find_service = await service.findByPk(serviceId)
    const service_name = find_service.serviceName

    const find_expert_service_id = await expert_service.findOne({
      where: { serviceId: serviceId, UserId: expert_id }
    })
    const find_service_cost = find_expert_service_id.expert_fees 

    add_booking.booking_id = bookingID
    add_booking.serviceId = serviceId;
    add_booking.discounted_amount = find_service_cost;
    add_booking.GST = GST;
    add_booking.UserId = user_id;
    add_booking.expert_id = expert_id;
    add_booking.in_progress_time = time;

    add_booking.expertServiceId = find_expert_service_id.id;

    await add_booking.save();

    // const expert_id = find_service.UserId// 

    const user = await User.findByPk(user_id)
    const user_name = user.name
    const expert = await User.findByPk(expert_id)
    const expert_name = expert.name

    var message = {
      to: expert.device_id, // Assuming the user model has a device_id field
      notification: {
        title: `Booking Confirmation`,
        body: `Dear ${expert_name} you have received a service request from ${user_name} for ${service_name} with Booking ID ${add_booking.booking_id}.`,
      },

    }

    await Notification.create({
      message: message.notification.body,
      type: " Booking ",
      UserId: expert.id,
      data: add_booking
    });

    fcm.send(message, function (err, response) {
      if (err) {
        console.error("Error:", err.message);
        return res.status(200).json({ success: false, message: "Failed to send notification" });
      } else {
        console.log("Successfully sent with response: ", response);
        return res.status(200).json({
          status: true,
          message: "Booked successfully and notification sent",
          data: add_booking,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.get_booking_by_status = async (req, res) => {
  try {
    const { status, user_id } = req.body;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const isEmptykey = Object.keys(req.body).some((key) => {
      const value = req.body[key];
      return value === "" || value === null || value === undefined;
    });
    if (isEmptykey) {
      return res.status(200).json({ error: "please do not give empty fields" });
    }

    // if (status === "pending") {
    const pending_booking = await Booking_details.findAll({
      where: {
        [Sequelize.Op.or]: [
          {
            status: status,
            UserId: user_id,
          },
          {
            status: status,
            expert_id: user_id,
          }
        ]
      },
      include: [
        {
          model: User,
          as: "User",
          where: { id: Sequelize.col('booking_detail.UserId') }
        },
        {
          model: expert_service,
          as: "expert_service",
          include: [
            {
              model: User,
              as: "User",
            },
            {
              model: service,
              as: "service",
              // where: { id: Sequelize.col('service.UserId') } // Here, we specify the association between the User model and the service model using the UserId from the service object
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset,
    });

     const totalCount = await Booking_details.count({
      where: {
        deleted_At:null,
        [Sequelize.Op.or]: [
          {
            status: status,
            UserId: user_id,
          },
          {
            status: status,
            expert_id: user_id,
          }
        ]
      }
     });
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      status: true,
      message: "pending bookings",
      count: totalCount,
      data: pending_booking,
      currentPage: page,
      totalPages: totalPages,
    });


    // if (status === "reject") {
    //   const rejected_booking = await Booking_details.findAll({
    //     where : {
    //       [Sequelize.Op.or]: [
    //         { 
    //           status: status,
    //            UserId: user_id,
    //         },
    //         { 
    //           status: status,
    //            expert_id: user_id,
    //         }
    //     ]
    //     },
    //     include: [
    //       {
    //         model: User,
    //         as: "User",
    //         where: { id: Sequelize.col('booking_detail.UserId') }
    //       },
    //       {
    //         model: service,
    //         as: "service",
    //         include: [
    //           {
    //             model: User,
    //             as: "User",
    //             where: { id: Sequelize.col('service.UserId') } // Here, we specify the association between the User model and the service model using the UserId from the service object
    //           }
    //         ]
    //       }
    //     ],
    //     order: [['createdAt', 'DESC']],
    //   });

    //   return res.status(200).json({
    //     status: true,
    //     message: "rejected bookings",
    //     data: rejected_booking,
    //   });
    // }

    // if (status === "approved") {
    //   const approved_booking = await Booking_details.findAll({
    //     where : {
    //       [Sequelize.Op.or]: [
    //         { 
    //           status: status,
    //            UserId: user_id,
    //         },
    //         { 
    //           status: status,
    //            expert_id: user_id,
    //         }
    //     ]
    //     },
    //     include: [
    //       {
    //         model: User,
    //         as: "User",
    //         where: { id: Sequelize.col('booking_detail.UserId') }
    //       },
    //       {
    //         model: service,
    //         as: "service",
    //         include: [
    //           {
    //             model: User,
    //             as: "User",
    //             where: { id: Sequelize.col('service.UserId') } // Here, we specify the association between the User model and the service model using the UserId from the service object
    //           }
    //         ]
    //       }
    //     ],
    //     order: [['createdAt', 'DESC']],

    //   });

    //   return res.status(200).json({
    //     status: true,
    //     message: "approved bookings",
    //     data: approved_booking,
    //   });
    // }

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.getBooking_by_status_only = async (req, res) => {
  try {
    const { status } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    let query = {
      where: {},
    };

    // If `status` is provided, filter bookings by that status
    if (status) {
      query.where.status = { [Sequelize.Op.like]: `%${status}%` };
    }

    const pending_bookings = await Booking_details.findAll({
      // where: { status: status },
      where: query.where,
      include: [
        {
          model: User,
          as: "User",
          where: { id: Sequelize.col('booking_detail.UserId') }
        },
        {
          model: expert_service,
          as: "expert_service",
          include: [
            {
              model: User,
              as: "User",
            },
            {
              model: service,
              as: "service",
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset,
    });

    const totalCount = await Booking_details.count({where: query.where});
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      status: true,
      message: " Bookings fetched successfully",
      count: totalCount,
      data: pending_bookings,
      currentPage: page,
      totalPages: totalPages,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};


// get all Bookings 
// exports.getAll_bookings = async (req, res) => {
//   try {

//     const get_all_booking = await Booking_details.findAll({
//       include: [
//         {
//           model: User,
//           as: "User",
//           where: { id: Sequelize.col('booking_detail.UserId') }
//         },
//         {
//           model: service,
//           as: "service",
//           include: [
//             {
//               model: User,
//               as: "User",
//               where: { id: Sequelize.col('service.UserId') } // Here, we specify the association between the User model and the service model using the UserId from the service object
//             }
//           ]
//         }
//       ],
//       order: [['createdAt', 'DESC']],
//     })

//     return res.status(200).json({
//       status: true,
//       message: "All Booking",
//       data: get_all_booking
//     })

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// }

exports.getAll_bookings = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const get_all_booking = await Booking_details.findAll({
      attributes: { exclude: ['GST', 'cosulting_fee', 'total_amount', 'service_tax', 'service_image'] },
      include: [
        {
          model: User,
          as: "User",
          attributes: ['id', 'name', 'user_type', 'phone_no'],
          where: { id: Sequelize.col('booking_detail.UserId') }
        },
        {
          model: expert_service,
          as: "expert_service",
          include: [
            {
              model: User,
              as: "User"
            },
            {
              model: service,
              as: "service",
              // attributes:['serviceName','service_cost','UserId','categoryId','status'],
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset,
    })

    const totalCount = await Booking_details.count({});
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      status: true,
      message: "All Booking",
      count: totalCount,
      data: get_all_booking,
      currentPage: page,
      totalPages: totalPages,
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
}

// get Bookings by id 

exports.get_bookings_by_user_id = async (req, res) => {
  try {
    const { user_id } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const get_booking = await Booking_details.findAll({
      // where: { UserId: user_id },
      where: {
        [Sequelize.Op.or]: [
          {
            UserId: user_id,
          },
          {
            expert_id: user_id,
          }
        ]
      },
      include: [
        {
          model: User,
          as: "User",
          where: { id: Sequelize.col('booking_detail.UserId') } // finding expert 
        },
        {
          model: expert_service,
          as: "expert_service",
          include: [
            {
              model: User,
              as: "User",
            },
            {
              model: service,
              as: "service",
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset,
    })

     const totalCount = await Booking_details.count({
      where: {
        deleted_At:null,
        [Sequelize.Op.or]:[
        {
          UserId: user_id,
        },
        {
          expert_id: user_id,
        }
      ]
      
    }});
    const totalPages = Math.ceil(totalCount/ limit);


    // if (get_booking == []) {
    //   const get_booking = await Booking_details.findAll({
    //     where: { UserId: user_id },
    //     include: [
    //       {
    //         model: User,
    //         as: "User",
    //         where: { id: Sequelize.col('booking_detail.UserId') } // finding expert 
    //       },
    //       {
    //         model: expert_service,
    //         as: "expert_service",
    //         include: [
    //           {
    //             model: User,
    //             as: "User",
    //           },
    //           {
    //             model: service,
    //             as: "service",
    //           }
    //         ]
    //       }
    //     ],
    //     order: [['createdAt', 'DESC']],
    //     limit: limit,
    //     offset: offset,
    //   })
    // }

    return res.status(200).json({
      status: true,
      message: "All Booking",
      count:totalCount,
      data: get_booking,
      currentPages: page,
      totalPages:totalPages
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
}

// Delete Booking by id
exports.delete_booking_by_id = async (req, res) => {
  try {
    const { booking_id } = req.params
    const cancel_booking = await Booking_details.findByPk(booking_id)
    if (cancel_booking) {
      await cancel_booking.destroy(cancel_booking)
      return res.status(200).json({
        status: true,
        message: "Booking delete Successfully"
      })
    } else {
      return res.status(400).json({
        status: false,
        message: "Booking Id not found or Booking not deleted"
      })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
}

// Origional
// exports.Cancle_booking_by_id = async (req, res) => {
//   try {
//     const { booking_id, time, status , cancellation_reason } = req.query;

//     const find_admin_percentage = await admin_setting.findByPk(12)
//     const admin_booking_percentage = parseFloat(find_admin_percentage.admin_per_booking / 100)

//     // Find booking by ID
//     const cancel_booking = await Booking_details.findByPk(booking_id);

//     if (!cancel_booking) {
//       return res.status(200).json({ status: false, message: "Booking not found" });
//     }
//     if(cancel_booking.status == "cancel"){
//       return res.status(200).json({status:false ,message: "your booking is already cancelled"})
//     }

//     const { payment_status, status: bookingStatus, UserId, expert_id, serviceId, discounted_amount } = cancel_booking;

//     const find_expert = await User.findByPk(expert_id);
//     const get_user_type = find_expert.user_type

//     if (payment_status === "unpaid") {
//       // Update booking status to cancelled if payment is unpaid
//       const status_change = await Booking_details.update(
//         { status: status ,cancellation_reason:cancellation_reason},
//         { where: { id: booking_id } }
//       );

//       // return res.status(200).json({ status: true, message: "Booking is cancelled", data: status_change });
//     }

//     if (bookingStatus === "approved" && payment_status === "paid") {
//       // Calculate time difference in minutes between current time and in_progress_time
//       const bookingInProgressTime = new Date(cancel_booking.in_progress_time);
//       const currentTime = new Date();
//       const timeDifferenceMinutes = Math.floor((currentTime - bookingInProgressTime) / (1000 * 60));

//       if (timeDifferenceMinutes > 1440) {
//         return res.status(200).json({ status: true, message: "Booking can not be cancelled, please read cancellation policy" });
//       }

//       // Process refund if booking status is approved and cancellation is within 24 hours
//       if (timeDifferenceMinutes < 1440) {
//         const userWallet = await wallet_system.findOne({ where: { UserId } });

//         const expert_wallet = await wallet_system.findOne({ where: { UserId: expert_id } })

//         if (userWallet) {


//           // for expert deduction 
//           const expert_percentage = parseFloat(1 - admin_booking_percentage)
//           const expert_amount = parseFloat(discounted_amount * expert_percentage)
//           const newBalanceOfExpert = parseFloat(expert_wallet.wallet_amount) -
//             parseFloat(discounted_amount * expert_percentage);

//           await wallet_system.update(
//             { wallet_amount: newBalanceOfExpert },
//             { where: { UserId: expert_id } }
//           );

//           // Giving Refund to user 
//           const newBalanceOfUser = parseFloat(userWallet.wallet_amount) + parseFloat(expert_amount);

//           await wallet_system.update(
//             { wallet_amount: newBalanceOfUser },
//             { where: { UserId } }
//           );

//           // console.log("Full refund processed successfully within 24 hours");

//           const allTransaction = await TransactionHistory.bulkCreate([
//             {
//               UserId: UserId,
//               payment_method:"wallet",
//               payment_status:"wallet_transaction",
//               transaction_amount: expert_amount,
//               // transaction_id,
//               // device_id,
//               status: 1,
//               amount_receiver_id: UserId,
//               expert_id: expert_id,
//               user_type: 1,
//               deduct_type: "refund",
//               description:cancellation_reason
//             },
//             {
//               UserId: expert_id,
//               payment_method:"wallet",
//               payment_status:"wallet_transaction",
//               transaction_amount: expert_amount,
//               // transaction_id,
//               // device_id,
//               status: 1,
//               amount_receiver_id: UserId,
//               expert_id: expert_id,
//               user_type: get_user_type,
//               deduct_type: "refund",
//               description:cancellation_reason

//             },

//           ]);
//         }
//       }

//       const status_change = await Booking_details.update(
//         { status: status ,cancellation_reason : cancellation_reason},
//         { where: { id: booking_id } }
//       );
//     }

//     // Process refund if booking status is pending and payment is paid
//     if (bookingStatus === "pending" && payment_status === "paid") {
//       const userWallet = await wallet_system.findOne({ where: { UserId } });

//       const admin_id = 9
//       const admin_wallet = await wallet_system.findOne({ where: { UserId: admin_id } })

//       const expert_wallet = await wallet_system.findOne({ where: { UserId: expert_id } })


//       if (userWallet) {
//         // For Admin deduction 
//         const admin_amount = parseFloat(discounted_amount * admin_booking_percentage);
//         const newBalanceOfAdmin = parseFloat(admin_wallet.wallet_amount) -
//           parseFloat(discounted_amount * admin_booking_percentage);

//         await wallet_system.update(
//           { wallet_amount: newBalanceOfAdmin },
//           { where: { UserId: admin_id } }
//         );

//         // for expert deduction 
//         const expert_percentage = parseFloat(1 - admin_booking_percentage)
//         const expert_amount = parseFloat(discounted_amount * expert_percentage)
//         const newBalanceOfExpert = parseFloat(expert_wallet.wallet_amount) -
//           parseFloat(discounted_amount * expert_percentage);

//         await wallet_system.update(
//           { wallet_amount: newBalanceOfExpert },
//           { where: { UserId: expert_id } }
//         );
//         // Giving Refund to user 

//         const newBalanceOfUser = parseFloat(userWallet.wallet_amount) + parseFloat(discounted_amount);

//         await wallet_system.update(
//           { wallet_amount: newBalanceOfUser },
//           { where: { UserId : UserId} }
//         );

//         const allTransaction = await TransactionHistory.bulkCreate([
//           {
//             UserId: UserId,
//             payment_method:"wallet",
//             payment_status:"wallet_transaction",
//             transaction_amount: discounted_amount,
//             // transaction_id,
//             // device_id,
//             status: 1,
//             amount_receiver_id: UserId,
//             expert_id: expert_id,
//             user_type: 1,
//             deduct_type: "refund",
//             description:cancellation_reason

//           },
//           {
//             UserId: expert_id,
//             payment_method:"wallet",
//             payment_status:"wallet_transaction",
//             transaction_amount: expert_amount,
//             // transaction_id,
//             // device_id,
//             status: 1,
//             amount_receiver_id: UserId,
//             expert_id: expert_id,
//             user_type: get_user_type,
//             deduct_type: "refund",
//             description:cancellation_reason

//           },
//           {
//             UserId: admin_id,
//             payment_method:"wallet",
//             payment_status:"wallet_transaction",
//             transaction_amount: admin_amount,
//             // transaction_id,
//             // device_id,
//             status: 1,
//             amount_receiver_id: UserId,
//             expert_id: expert_id,
//             user_type: 0,
//             deduct_type: "refund",
//             description:cancellation_reason

//           }
//         ]);

//       }
//       const status_change = await Booking_details.update(
//         { status: status , cancellation_reason :cancellation_reason},
//         { where: { id: booking_id } }
//       );
//     }

//     // Send notification to expert about booking cancellation
//     const user = await User.findByPk(UserId);
//     const expert = await User.findByPk(expert_id);
//     const serviceDetails = await service.findByPk(serviceId);

//     const service_name = serviceDetails ? serviceDetails.serviceName : 'Unknown Service';
//     const user_name = user ? user.name : 'Unknown User';

//     const message = {
//       to: expert.device_id, // Assuming the user model has a device_id field
//       notification: {
//         title: `Booking Cancellation`,
//         body: `Booking service for ${service_name} is cancelled by ${user_name}.`,
//       },
//     };

//     await Notification.create({
//       message: message.notification.body,
//       type: "Booking_cancellation",
//       UserId: expert.id
//     });

//     // Send FCM notification
//     fcm.send(message, (err, response) => {
//       if (err) {
//         console.error("FCM notification error:", err);
//         return res.status(200).json({ status: false, message: "Failed to send notification" });
//       } else {
//         console.log("FCM notification sent successfully:", response);
//         return res.status(200).json({
//           status: true,
//           message: "Booking is cancelled and notification sent",
//         });
//       }
//     });

//   } catch (error) {
//     console.error("Error in cancelling booking:", error);
//     return res.status(500).json({ status: false, message: error.message });
//   }
// };


exports.Cancle_booking_by_id = async (req, res) => {
  try {
    const { booking_id, time, status, cancellation_reason, is_cancel_status } = req.query;

    const find_admin_percentage = await admin_setting.findByPk(12)
    const admin_booking_percentage = parseFloat(find_admin_percentage.admin_per_booking / 100)

    // Find booking by ID
    const cancel_booking = await Booking_details.findByPk(booking_id);

    if (!cancel_booking) {
      return res.status(200).json({ status: false, message: "Booking not found" });
    }
    if (cancel_booking.status == "cancel") {
      return res.status(200).json({ status: false, message: "your booking is already cancelled" })
    }
     if (cancel_booking.is_cancel_status == "cancellation_pending") {
       return res
         .status(200)
         .json({
           status: false,
           message:
             "You already cancelled the booking, please wait until expert approve or reject your cancellation request."
         });
     }

    const { payment_status, status: bookingStatus, UserId, expert_id, serviceId, discounted_amount } = cancel_booking;

    const find_expert = await User.findByPk(expert_id);
    const get_user_type = find_expert.user_type

    // User End Cancel booking
    if (status == "cancel" && payment_status === "unpaid") {
      // Update booking status to cancelled if payment is unpaid
      const status_change = await Booking_details.update(
        { status: status, cancellation_reason: cancellation_reason },
        { where: { id: booking_id } }
      );

      // return res.status(200).json({ status: true, message: "Booking is cancelled", data: status_change });
      // Send notification to expert about booking cancellation
    const user = await User.findByPk(UserId);
    const expert = await User.findByPk(expert_id);
    const serviceDetails = await service.findByPk(serviceId);

    const service_name = serviceDetails ? serviceDetails.serviceName : 'Unknown Service';
    const user_name = user ? user.name : 'Unknown User';
    const expert_name = expert ? expert.name : 'Unknown User';


    const message = {
      to: expert.device_id, // Assuming the user model has a device_id field
      notification: {
        title: `Booking Cancellation`,
        body: `Dear ${expert_name},your unpaid booking service for ${service_name} is cancelled by ${user_name}.`,
      },
    };

    await Notification.create({
      message: message.notification.body,
      type: "Booking_cancellation",
      UserId: expert.id,
      data: cancel_booking,

    });

    // Send FCM notification
    fcm.send(message, (err, response) => {
      if (err) {
        console.error("FCM notification error:", err);
        return res.status(200).json({ status: false, message: "Failed to send notification" });
      } else {
        console.log("FCM notification sent successfully:", response);
        return res.status(200).json({
          status: true,
          message: "Booking is cancelled and notification sent",
        });
      }
    });
    }

    // User End Cancel booking

    if ( status == "cancel" && payment_status == "paid" && bookingStatus === "approved") {

      // Update booking status to cancelled if status is cancel
      const status_change = await Booking_details.update(
        { is_cancel_status: "cancellation_pending", cancellation_reason: cancellation_reason  },
        { where: { id: booking_id } }
      );


      // Send notification to expert about booking cancellation
      const user = await User.findByPk(UserId);
      const expert = await User.findByPk(expert_id);
      const serviceDetails = await service.findByPk(serviceId);

      const service_name = serviceDetails ? serviceDetails.serviceName : 'Unknown Service';
      const user_name = user ? user.name : 'Unknown User';
      const expert_name = expert ? expert.name: "Unknown expert"

      const message = {
        to: expert.device_id, // Assuming the user model has a device_id field
        notification: {
          title: `Booking Cancellation Request`,
          body: `Dear ${expert_name}, cancellation request received for Booking ID:${cancel_booking.booking_id} `,
        },
      };

      await Notification.create({
        message: message.notification.body,
        type: "Booking Cancellation Request",
        UserId: expert.id,
        data: cancel_booking,

      });

      // Send FCM notification
      fcm.send(message, (err, response) => {
        if (err) {
          console.error("FCM notification error:", err);
          return res.status(200).json({ status: false, message: "Failed to send notification" });
        } else {
          console.log("FCM notification sent successfully:", response);
          return res.status(200).json({
            status: true,
            message: "Request for Booking cancellation is send successfully and notification sent",
          });
        }
      });

    }

    // Expert End Cancel booking

    if(is_cancel_status == "cancellation_reject"){
      // Update booking status to cancelled if status is reject
      const status_change = await Booking_details.update(
        { is_cancel_status: "cancellation_reject" },
        { where: { id: booking_id } }
      );

      // Send notification to expert about booking cancellation
      const user = await User.findByPk(UserId);
      const expert = await User.findByPk(expert_id);
      const serviceDetails = await service.findByPk(serviceId);

      const service_name = serviceDetails ? serviceDetails.serviceName : 'Unknown Service';
      const user_name = user ? user.name : 'Unknown User';
      const expert_name = expert ? expert.name: "Unknown expert"

      const message = {
        to: user.device_id, // Assuming the user model has a device_id field
        notification: {
          title: `Rejection for Booking Cancellation `,
          body: `Dear ${user_name},${expert_name} declined your cancelllation request for ${cancel_booking.booking_id}.`,
        },
      };

      await Notification.create({
        message: message.notification.body,
        type: "Rejection for Booking Cancellation",
        UserId: user.id,
        data: cancel_booking,

      });

      // Send FCM notification
      fcm.send(message, (err, response) => {
        if (err) {
          console.error("FCM notification error:", err);
          return res.status(200).json({ status: false, message: "Failed to send notification" });
        } else {
          console.log("FCM notification sent successfully:", response);
          return res.status(200).json({
            status: true,
            message: "Request for Booking Cancellation is rejected and notification sent",
          });
        }
      });
  }

    // Expert End Cancel booking

    if(is_cancel_status == "cancellation_approved"){ 

    if (bookingStatus === "approved" && payment_status === "paid") {
      
      // Calculate time difference in minutes between current time and in_progress_time
      const bookingInProgressTime = new Date(cancel_booking.in_progress_time);
      const currentTime = new Date();
      // const timeDifferenceMinutes = Math.floor((currentTime - bookingInProgressTime) / (1000 * 60));

      // if (timeDifferenceMinutes > 1440) {
      //   return res.status(200).json({ status: true, message: "Booking can not be cancelled, please read cancellation policy" });
      // }

      // Process refund if booking status is approved and cancellation is within 24 hours
      // if (timeDifferenceMinutes < 1440) {
        const userWallet = await wallet_system.findOne({ where: { UserId } });

        const expert_wallet = await wallet_system.findOne({ where: { UserId: expert_id } })

        if (userWallet) {


          // for expert deduction 
          const expert_percentage = parseFloat(1 - admin_booking_percentage)
          const expert_amount = parseFloat(discounted_amount * expert_percentage)
          const newBalanceOfExpert = parseFloat(expert_wallet.wallet_amount) -
            parseFloat(discounted_amount * expert_percentage);

          await wallet_system.update(
            { wallet_amount: newBalanceOfExpert },
            { where: { UserId: expert_id } }
          );

          // Giving Refund to user 
          const newBalanceOfUser = parseFloat(userWallet.wallet_amount) + parseFloat(expert_amount);

          await wallet_system.update(
            { wallet_amount: newBalanceOfUser },
            { where: { UserId } }
          );

          // console.log("Full refund processed successfully within 24 hours");

          const allTransaction = await TransactionHistory.bulkCreate([
            {
              UserId: UserId,
              payment_method: "wallet",
              payment_status: "Refund for booking ",
              transaction_amount: expert_amount,
              // transaction_id,
              // device_id,
              status: 1,
              amount_receiver_id: UserId,
              expert_id: expert_id,
              user_type: 1,
              deduct_type: "refund",
              description: cancellation_reason
            },
            {
              UserId: expert_id,
              payment_method: "wallet",
              payment_status: "deduct for Refund",
              transaction_amount: expert_amount,
              // transaction_id,
              // device_id,
              status: 1,
              amount_receiver_id: UserId,
              expert_id: expert_id,
              user_type: get_user_type,
              deduct_type: "deducted (refund to user )",
              description: "Deducted, refunded to user",

            },

          ]);
        }
      // }

      const status_change = await Booking_details.update(
        { status: "cancel" ,is_cancel_status : is_cancel_status,cancel_time: time},
        { where: { id: booking_id } }
      );
    }

    const expert_percentage = parseFloat(1 - admin_booking_percentage)
    const expert_amount = parseFloat(discounted_amount * expert_percentage)

    // Send notification to expert about booking cancellation
    const user = await User.findByPk(UserId);
    const expert = await User.findByPk(expert_id);
    const serviceDetails = await service.findByPk(serviceId);

    const service_name = serviceDetails ? serviceDetails.serviceName : 'Unknown Service';
    const user_name = user ? user.name : 'Unknown User';
    const expert_name = expert ? expert.name : 'Unknown User';


    const message = {
      to: user.device_id, // Assuming the user model has a device_id field
      notification: {
        title: `Booking Cancellation`,
        body: `Dear ${user_name} your cancellation request for Booking ID: ${cancel_booking.booking_id} has been accepted by ${expert_name}. ${expert_amount} added to your wallet.`,
      },
    };

    await Notification.create({
      message: message.notification.body,
      type: "Booking_cancellation",
      UserId: user.id,
      data: cancel_booking,

    });

    // Send FCM notification
    fcm.send(message, (err, response) => {
      if (err) {
        console.error("FCM notification error:", err);
        return res.status(200).json({ status: false, message: "Failed to send notification" });
      } else {
        console.log("FCM notification sent successfully:", response);
        return res.status(200).json({
          status: true,
          message: "Booking is cancelled and notification sent",
        });
      }
    });
  }

    // Process refund if booking status is pending and payment is paid on Expert end
    if (bookingStatus === "pending" && payment_status === "paid") {

      const userWallet = await wallet_system.findOne({ where: { UserId : UserId} });

      const admin_id = 9
      const admin_wallet = await wallet_system.findOne({ where: { UserId: admin_id } })

      const expert_wallet = await wallet_system.findOne({ where: { UserId: expert_id } })


      if (userWallet) {
        // For Admin deduction 
        const admin_amount = parseFloat(discounted_amount * admin_booking_percentage);
        const newBalanceOfAdmin = parseFloat(admin_wallet.wallet_amount) -
          parseFloat(discounted_amount * admin_booking_percentage);

        await wallet_system.update(
          { wallet_amount: newBalanceOfAdmin },
          { where: { UserId: admin_id } }
        );

        // for expert deduction 
        const expert_percentage = parseFloat(1 - admin_booking_percentage)
        const expert_amount = parseFloat(discounted_amount * expert_percentage)
        const newBalanceOfExpert = parseFloat(expert_wallet.wallet_amount) -
          parseFloat(discounted_amount * expert_percentage);

        await wallet_system.update(
          { wallet_amount: newBalanceOfExpert },
          { where: { UserId: expert_id } }
        );
        // Giving Refund to user 

        const newBalanceOfUser = parseFloat(userWallet.wallet_amount) + parseFloat(discounted_amount);

        await wallet_system.update(
          { wallet_amount: newBalanceOfUser },
          { where: { UserId: UserId } }
        );

        const allTransaction = await TransactionHistory.bulkCreate([
          {
            UserId: UserId,
            payment_method: "wallet",
            payment_status: "Refund for booking ",
            transaction_amount: discounted_amount,
            // transaction_id,
            // device_id,
            status: 1,
            amount_receiver_id: UserId,
            expert_id: expert_id,
            user_type: 1,
            deduct_type: "refund",
            description: cancellation_reason

          },
          {
            UserId: expert_id,
            payment_method: "wallet",
            payment_status: "deduct for Refund ",
            transaction_amount: expert_amount,
            // transaction_id,
            // device_id,
            status: 1,
            amount_receiver_id: UserId,
            expert_id: expert_id,
            user_type: get_user_type,
            deduct_type: "deducted (refund to user )",
            description: "Deducted, refunded to user ",

          },
          {
            UserId: admin_id,
            payment_method: "wallet",
            payment_status: "deduct for Refund",
            transaction_amount: admin_amount,
            // transaction_id,
            // device_id,
            status: 1,
            amount_receiver_id: UserId,
            expert_id: expert_id,
            user_type: 0,
            deduct_type: "deducted (refund to user )",
            description: cancellation_reason

          }
        ]);

      }
      const status_change = await Booking_details.update(
        { status: status, cancellation_reason: cancellation_reason ,cancel_time: time},
        { where: { id: booking_id } }
      );

        // Send notification to expert about booking cancellation
    const user = await User.findByPk(UserId);
    const expert = await User.findByPk(expert_id);
    const serviceDetails = await service.findByPk(serviceId);

    const service_name = serviceDetails ? serviceDetails.serviceName : 'Unknown Service';
    const user_name = user ? user.name : 'Unknown User';
    const expert_name = expert ? expert.name : 'Unknown User';


    const message = {
      to: expert.device_id, // Assuming the user model has a device_id field
      notification: {
        title: `Booking Cancellation`,
        body: `Dear ${expert_name} the service for the booking ID:${cancel_booking.booking_id}, has been cancelled by ${user_name}.`,
      },
    };

    await Notification.create({
      message: message.notification.body,
      type: "Booking_cancellation",
      UserId: expert.id,
      data: cancel_booking,

    });

    // Send FCM notification
    fcm.send(message, (err, response) => {
      if (err) {
        console.error("FCM notification error:", err);
        return res.status(200).json({ status: false, message: "Failed to send notification" });
      } else {
        console.log("FCM notification sent successfully:", response);
        return res.status(200).json({
          status: true,
          message: "Booking is cancelled and notification sent",
        });
      }
    });
    }


  } catch (error) {
    console.error("Error in cancelling booking:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.update_Booking_by_status = async (req, res) => {
  try {
    const { status, booking_id, discounted_amount, time } = req.body;

    const find_admin_percentage = await admin_setting.findByPk(12)
    const admin_booking_percentage = parseFloat(find_admin_percentage.admin_per_booking / 100)

    if (!booking_id) {
      return res.status(200).json({ error: "please do not give empty fileds" });
    }

    // console.log(status, discounted_amount)
    const reject_booking = await Booking_details.findByPk(booking_id);

    const { payment_status , UserId , expert_id,discounted_amount: reject_discounted_amount,serviceId} = reject_booking;

    const find_expert = await User.findByPk(expert_id);
    const get_user_type = find_expert.user_type
  // Process refund if booking status is pending and payment is paid on Expert end
  if (status === "reject" && payment_status === "paid") {

    const userWallet = await wallet_system.findOne({ where: { UserId : UserId} });

    const admin_id = 9
    const admin_wallet = await wallet_system.findOne({ where: { UserId: admin_id } })

    const expert_wallet = await wallet_system.findOne({ where: { UserId: expert_id } })


    if (userWallet) {
      // For Admin deduction 
      const admin_amount = parseFloat(reject_discounted_amount * admin_booking_percentage);
      const newBalanceOfAdmin = parseFloat(admin_wallet.wallet_amount) -
        parseFloat(reject_discounted_amount * admin_booking_percentage);

      await wallet_system.update(
        { wallet_amount: newBalanceOfAdmin },
        { where: { UserId: admin_id } }
      );

      // for expert deduction 
      const expert_percentage = parseFloat(1 - admin_booking_percentage)
      const expert_amount = parseFloat(reject_discounted_amount * expert_percentage)
      const newBalanceOfExpert = parseFloat(expert_wallet.wallet_amount) -
        parseFloat(reject_discounted_amount * expert_percentage);

      await wallet_system.update(
        { wallet_amount: newBalanceOfExpert },
        { where: { UserId: expert_id } }
      );
      // Giving Refund to user 

      const newBalanceOfUser = parseFloat(userWallet.wallet_amount) + parseFloat(reject_discounted_amount);

      await wallet_system.update(
        { wallet_amount: newBalanceOfUser },
        { where: { UserId: UserId } }
      );

      const allTransaction = await TransactionHistory.bulkCreate([
        {
          UserId: UserId,
          payment_method: "wallet",
          payment_status: "Refund",
          transaction_amount: reject_discounted_amount,
          // transaction_id,
          // device_id,
          status: 1,
          amount_receiver_id: UserId,
          expert_id: expert_id,
          user_type: 1,
          deduct_type: "refund",
          description: "refund because of booking rejection"

        },
        {
          UserId: expert_id,
          payment_method: "wallet",
          payment_status: "deduct",
          transaction_amount: expert_amount,
          // transaction_id,
          // device_id,
          status: 1,
          amount_receiver_id: UserId,
          expert_id: expert_id,
          user_type: get_user_type,
          deduct_type: "deducted (refund to user )",
          description: "deduct because of booking rejection",

        },
        {
          UserId: admin_id,
          payment_method: "wallet",
          payment_status: "deduct",
          transaction_amount: admin_amount,
          // transaction_id,
          // device_id,
          status: 1,
          amount_receiver_id: UserId,
          expert_id: expert_id,
          user_type: 0,
          deduct_type: "deducted (refund to user )",
          description: "deduct because of booking rejection from expert"

        }
      ]);

    }
    const status_change = await Booking_details.update(
      { status: status,rejected_time: time},
      { where: { id: booking_id } }
    );

      // Send notification to expert about booking cancellation
  const user = await User.findByPk(UserId);
  const expert = await User.findByPk(expert_id);
  const serviceDetails = await service.findByPk(serviceId);

  const service_name = serviceDetails ? serviceDetails.serviceName : 'Unknown Service';
  const user_name = user ? user.name : 'Unknown User';
  const expert_name = expert ? expert.name : 'Unknown User';


  const message = {
    to: user.device_id, // Assuming the user model has a device_id field
    notification: {
      title: `Booking Cancellation`,
      body: `Dear ${user_name} the service for the booking ID:${reject_booking.booking_id}, has been rejected by ${expert_name}.`,
    },
  };

  await Notification.create({
    message: message.notification.body,
    type: "Booking_rejection",
    UserId: user.id,
    data: reject_booking,

  });

  // Send FCM notification
  fcm.send(message, (err, response) => {
    if (err) {
      console.error("FCM notification error:", err);
      return res.status(200).json({ status: false, message: "Failed to send notification" });
    } else {
      console.log("FCM notification sent successfully:", response);
      return res.status(200).json({
        status: true,
        message: "Booking is cancelled and notification sent",
      });
    }
  });
  }else{ 
    const discounted_price = parseFloat(discounted_amount);
    const find_booking = await Booking_details.findByPk(booking_id)

    const update_booking = await Booking_details.update(
      {
        status: status,
        // discounted_amount : discounted_price
      },
      {
        where: {
          id: booking_id,
          // payment_status:"paid"
        },
      }
    );
    if (status == "approved") {
      find_booking.accepted_time = time
      await find_booking.save()
    }
    // if (status == "reject") {
    //   find_booking.rejected_time = time
    //   await find_booking.save()
    // }
    if (status == "paid") {
      find_booking.paid_time = time
      await find_booking.save()
    }
    if (status == "completed") {
      find_booking.completed_time = time
      await find_booking.save()
    }

    if (discounted_price) {
      find_booking.discounted_amount = discounted_price;
      await find_booking.save();
    }

    const user = await User.findByPk(find_booking.UserId)
    const expert = await User.findByPk(find_booking.expert_id)

    const find_service = await service.findByPk(find_booking.serviceId)
    const service_name = find_service.serviceName

    // const expert_name = expert.name
    const expert_name = expert ? expert.name : 'Unknown User';

    // var message = {
    //   to: user.device_id, // Assuming the user model has a device_id field
    //   notification: {
    //     title: `Booking Confirmation`,
    //     body: `Dear ${user.name}, your service request for ${service_name} with Booking ID : ${booking_id} has been ${status} by ${expert_name}.`,
    //   }, 
    // }

    var message = {
      to: user.device_id, // Assuming the user model has a device_id field
      notification: {
        title: `Booking Confirmation`,
        body: `Dear ${user.name}, your service request for ${service_name} with Booking ID : ${find_booking.booking_id}`,
      },
    };

    if (status) {
      message.notification.body += ` has been ${status} by ${expert_name}.`;
    } else if (discounted_amount) {
      message.notification.body += ` has got an offer of Rs.${discounted_price} by ${expert_name}.`;
    }


    await Notification.create({
      message: message.notification.body,
      type: " Booking_status ",
      UserId: user.id,
      data: find_booking,

    });

    fcm.send(message, function (err, response) {
      if (err) {
        console.error("Something went wrong!", err);
        return res.status(400).json({ success: false, message: err.message });
      } else {
        console.log("Successfully sent with response: ", response);
        // Proceed with your response
        return res.status(200).json({
          status: true,
          message: "Booking status updated and notification sent",
        });
      }
    });
}

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.update_Booking_by_payment_status = async (req, res) => {
  try {
    const { payment_status, booking_id, time } = req.body;


    if (!payment_status) {
      return res.status(400).json({ error: "please do not give empty fileds" });
    }

    const update_payment_status = await Booking_details.update(

      {
        payment_status: payment_status,
      },
      {
        where: {
          id: booking_id,
          payment_status: "unpaid"
        },
      }
    );


    const find_booking = await Booking_details.findByPk(booking_id)
    const user = await User.findByPk(find_booking.UserId)
    const expert = await User.findByPk(find_booking.expert_id)

    const find_service = await service.findByPk(find_booking.serviceId)
    const service_name = find_service.serviceName

    find_booking.paid_time = time;
    await find_booking.save();

    //console.log(expert)
    const user_name = user.name;
    const expert_name = expert.name

    var message = {
      to: expert.device_id, // Assuming the user model has a device_id field
      notification: {
        title: `Payment Confirmation`,
        body: `Booking service for ${service_name} with Booking ID : ${find_booking.booking_id},of Rs.${find_booking.discounted_amount} is ${payment_status} by ${user_name}.`,
      },
    }

    await Notification.create({
      message: message.notification.body,
      type: " payment_status ",
      UserId: expert.id,
      data:find_booking
    });

    fcm.send(message, function (err, response) {
      if (err) {
        console.error("Something went wrong!", err);
        return res.status(400).json({ success: false, message: err.message });
      } else {
        console.log("Successfully sent with response: ", response);
        // Proceed with your response
        return res.status(200).json({
          status: true,
          message: "Payment_Status for the booking is Updated and notification sent",
          data: update_payment_status,
        });
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};




exports.getAllBookingdataForAll = async (req, res) => {

  const { id, email, name, phone_no, createdAt } = req.query;

  let query = {
    where: {},
  };

  if (id) {
    query.where.id = id; // Direct match
  }
  if (email) {
    query.where.email = { [Sequelize.Op.like]: `%${email}%` };
  }
  if (name) {
    query.where.name = { [Sequelize.Op.like]: `%${name}%` };
  }
  if (phone_no) {
    query.where.phone_no = { [Sequelize.Op.like]: `%${phone_no}%` };
  }
  if (createdAt) {
    query.where.createdAt = Sequelize.where(
      Sequelize.fn("date", Sequelize.col("createdAt")),
      "=",
      createdAt
    ); // Assumes createdAt is in 'YYYY-MM-DD' format
  }
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const get_all_booking = await Booking_details.findAll(
      {
        attributes: ['id', 'status', 'payment_status', 'createdAt'],
        include: [
          {
            model: User,
            as: "User",
            where: { id: Sequelize.col('booking_detail.UserId') },
            attributes: ['id', 'name', 'phone_no', 'user_type'],
          },
          // {
          //   model: service,
          //   as: "service",
          //   attributes : ['id', 'serviceName','UserId'],
          //   include: [
          //     {
          //       model: User,
          //       as: "User",
          //       where: { id: Sequelize.col('service.UserId') },
          //       attributes : ['id', 'name', 'phone_no', 'user_type'], // Here, we specify the association between the User model and the service model using the UserId from the service object
          //     }
          //   ]
          // }
          {
            model: expert_service,
            as: "expert_service",
            include: [
              {
                model: User,
                as: "User",
              },
              {
                model: service,
                as: "service",
              }
            ]
          }
        ],

        order: [['createdAt', 'DESC']],

        limit: limit,
        offset: offset,
      })

    const totalCount = get_all_booking.length;
    const totalPages = Math.ceil(totalCount / limit);

    const bookingStatusForPending = await Booking_details.findAndCountAll({
      where: {
        status: "pending",
      },
      include: [
        {
          model: User,
          as:"User",
          where: {
            deleted_At: null
          }
        }
      ]
    });
    const bookingStatusForApproved = await Booking_details.findAndCountAll({
      where: {
        status: "approved",
      },
      include: [
        {
          model: User,
          as:"User",
          where: {
            deleted_At: null
          }
        }
      ]
    });
    
    const bookingStatusForReject = await Booking_details.findAndCountAll({
      where: {
        status: "reject",
      },
      include: [
        {
          model: User,
          as:"User",
          where: {
            deleted_At: null
          }
        }
      ]
    });
    const users = await User.findAll({
      query,
      attributes: ['id', 'name', 'phone_no', 'user_type'],
    });


    return res.status(200).json({
      status: true,
      message: "All Booking",
      bookingStatusForPending: bookingStatusForPending.count || 0,
      bookingStatusForApproved: bookingStatusForApproved.count || 0,
      bookingStatusForReject: bookingStatusForReject.count || 0,
      data: get_all_booking,
      user: users,
      currentPage: page,
      totalPages: totalPages,
    })

  } catch (error) {

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
}


//for searching 

exports.getAll_bookingsBySearch = async (req, res) => {
  const { id, email_id, name, phone_no, date } = req.query;

  let query = {
    where: {},
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "name", "user_type", "phone_no"],
      },
      // {
      //   model: service,
      //   as: "service",
      //   attributes: ["id", "serviceName"],
      //   include: [
      //     {
      //       model: User,
      //       as: "User",
      //       attributes: ["id", "name", "user_type", "phone_no"],
      //     },
      //   ],
      // },
      {
        model: expert_service,
        as: "expert_service",
        include: [
          {
            model: User,
            as: "User",
          },
          {
            model: service,
            as: "service",
          }
        ]
      }
    ],
    attributes: ["id", "expert_id", "status", "payment_status", "createdAt"],
    order: [["createdAt", "DESC"]],
  };

  if (id) {
    query.where.id = id; // Direct match
  }
  if (email_id) {
    query.include[0].where = {
      ...query.include[0].where,
      email_id: { [Sequelize.Op.like]: `%${email_id}%` },
    };
  }
  if (name) {
    query.include[0].where = {
      ...query.include[0].where,
      name: { [Sequelize.Op.like]: `%${name}%` },
    };
  }
  if (phone_no) {
    query.include[0].where = {
      ...query.include[0].where,
      phone_no: { [Sequelize.Op.like]: `%${phone_no}%` },
    };
  }
  if (date) {
    query.where.createdAt = Sequelize.where(
      Sequelize.fn("date", Sequelize.col("booking_detail.createdAt")), // Specify booking_detail table
      "=",
      date
    ); // Assumes createdAt is in 'YYYY-MM-DD' format
  }

  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const bookings = await Booking_details.findAll({
      ...query,
      limit,
      offset,
    });

    const totalCount = await Booking_details.count({});
    const totalPages = Math.ceil(totalCount / limit);
    if (bookings.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Bookings found",
        data: bookings,
        currentPage: page,
        totalPages: totalPages,
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "No bookings found with the provided criteria",
        data: []
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
