// const { where } = require("sequelize");
const { Sequelize, where } = require("sequelize");
const db = require("../../../config/db.config");
const Booking_details = db.booking_detail;
const service = db.service;
const User = db.User;
const wallet_system =db.wallet_system
const Notification = db.notification;
const expert_service = db.expert_service
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
    const { serviceId, discounted_amount, GST, user_id ,time,expert_id} = req.body;

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
      where : { serviceId :serviceId ,UserId : expert_id}
    })
    
    add_booking.booking_id = bookingID
    add_booking.serviceId = serviceId;
    add_booking.discounted_amount = discounted_amount;
    add_booking.GST = GST;
    add_booking.UserId = user_id;
    add_booking.expert_id = expert_id;
    add_booking.in_progress_time = time;

    add_booking.expertServiceId = find_expert_service_id.id;

    await add_booking.save();
    
    // const expert_id = find_service.UserId// 

    const user = await User.findByPk(user_id)
    const user_name =  user.name
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
      UserId : expert.id
    });

    fcm.send(message, function(err, response) {
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
    const isEmptykey = Object.keys(req.body).some((key) => {
      const value = req.body[key];
      return value === "" || value === null || value === undefined;
    });
    if (isEmptykey) {
      return res.status(200).json({ error: "please do not give empty fields" });
    }

    // if (status === "pending") {
      const pending_booking = await Booking_details.findAll({
        where : {
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
      });

      return res.status(200).json({
        status: true,
        message: "pending bookings",
        data: pending_booking,
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
        // {
        //   model: service, // Assuming `Service` is the correct model name
        //   as: "service",
        //   include: [
        //     {
        //       model: User,
        //       as: "User",
        //       where: { id: Sequelize.col('service.UserId') }
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
    });

    return res.status(200).json({
      status: true,
      message: "Pending bookings fetched successfully",
      data: pending_bookings,
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
      attributes:{exclude: ['GST','cosulting_fee','total_amount','service_tax','service_image']},
      include: [
        {
          model: User,
          as: "User",
          attributes: ['id','name', 'user_type', 'phone_no'],
          where: { id: Sequelize.col('booking_detail.UserId') }
        },
        // {
        //   model: service,
        //   as: "service",
        //   attributes:['serviceName','service_cost','UserId','categoryId','status'],
        //   include: [
        //     {
        //       model: User,
        //       as: "User",
        //       attributes: ['id','name', 'user_type', 'phone_no'],
        //       where: { id: Sequelize.col('service.UserId') } 
        //     }
        //   ]
        // }
        {
          model: expert_service,
          as: "expert_service",
          include: [
            {
              model:User,
              as:"User"
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
      count:totalCount,
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
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const offset = (page - 1) * pageSize;
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
      
        // {
        //   model: service,
        //   as: "service",
        //   include: [
        //     {
        //       model: User,
        //       as: "User",
        //       where: { id: Sequelize.col('service.UserId') } // Here, we specify the association between the User model and the service model using the UserId from the service object
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
      offset: offset,
      limit: pageSize,
    })
    if(get_booking==[]){
      const get_booking = await Booking_details.findAll({
        where: { UserId: user_id },
        include: [
          {
            model: User,
            as: "User",
            where: { id: Sequelize.col('booking_detail.UserId') } // finding expert 
          },
        
          // {
          //   model: service,
          //   as: "service",
          //   include: [
          //     {
          //       model: User,
          //       as: "User",
          //       where: { id: Sequelize.col('service.UserId') } // Here, we specify the association between the User model and the service model using the UserId from the service object
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
        offset: offset,
        limit: pageSize,
      })
    }

    return res.status(200).json({
      status: true,
      message: "All Booking",
      data: get_booking,
      currentPages: page,
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


// Cancle Booking 
exports.Cancle_booking_by_id = async (req, res) => {
  try {
    const { booking_id ,time,expert_id,status} = req.query
    const cancel_booking = await Booking_details.findByPk(booking_id)
    const payment_status_of_booking = cancel_booking.payment_status

   if(payment_status_of_booking == "unpaid"){
    const status_change = await Booking_details.update(
      { status: status },
      { where: { id: booking_id } }
    );

    return res.status(200).json({ 
      status : true ,
       message : "Payment Status Updated Successfully",
       data:status_change
      })

   }

    if (cancel_booking) {
      const  user = await User.findByPk(cancel_booking.UserId)
      const expert= await User.findByPk(cancel_booking.expert_id)
  
      const find_service = await service.findByPk(cancel_booking.serviceId)
      const service_name = find_service.serviceName
      //console.log(expert)
      const user_name = user.name;
      
console.log(cancel_booking.UserId)

      const find_wallet_of_user = await wallet_system.findOne({
        where:{ UserId: cancel_booking.UserId }
      })

 const wallet_amounts =parseFloat( find_wallet_of_user.wallet_amount)

console.log(find_wallet_of_user.wallet_amount)

const discounted_amounts = parseFloat(cancel_booking.discounted_amount)

// const calculated_time = cancel_booking.in_progress_time - time


const bookingInProgressTime = new Date(cancel_booking.in_progress_time);
const currentTime = new Date();

const timeDifferenceMinutes = Math.floor((currentTime - bookingInProgressTime) / (1000 * 60));

if(cancel_booking.status == "pending" ){
 // Full Amount refund within one hour 
 const newBalance_of_user = wallet_amounts + discounted_amounts;
 await find_wallet_of_user.update(
   { wallet_amount: newBalance_of_user },
   { where: { UserId: user.id } }
 );
}

if(cancel_booking.status == "approved" && timeDifferenceMinutes < 1440){
  // Full Amount refund within 24 hour 
  const newBalance_of_user = wallet_amounts + discounted_amounts;
  await find_wallet_of_user.update(
    { wallet_amount: newBalance_of_user },
    { where: { UserId: user.id } }
  );
 }
      var message = {
        to: expert.device_id, // Assuming the user model has a device_id field
        notification: {
          title: `Booking Cancellation`,
          body: `Booking service for ${service_name} is cancelled by ${user_name}.`,
        }, 
      }
      await Notification.create({
        message: message.notification.body,
        type: " Booking_cancellation ",
        UserId : expert.id
      });

     
  
      fcm.send(message, function(err, response) {
        if (err) {
            console.error("Something went wrong!", err);
            return res.status(200).json({ success: false, message: err.message });
        } else {
            console.log("Successfully sent with response: ", response);
            // Proceed with your response
            return res.status(200).json({
                status: true,
                message: "Booking is cancelled and notification sent",
                data: status_change,
            });
        }
    });

    } else {
      return res.status(200).json({
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

exports.update_Booking_by_status = async (req, res) => {
  try {
    const { status ,booking_id, discounted_amount, time } = req.body;

  
    if (!booking_id) {
      return res.status(200).json({ error: "please do not give empty fileds" });
    }
    
    // console.log(status, discounted_amount)

const discounted_price = parseFloat(discounted_amount);
const find_booking = await Booking_details.findByPk(booking_id)

    const update_booking = await Booking_details.update( 
      {
        status: status,
        // discounted_amount : discounted_price
      },
      {
        where: {
          id:booking_id,
          // payment_status:"paid"
        },
      }
    );
if(status=="approved"){
  find_booking.accepted_time = time
  await find_booking.save()
}
if(status=="reject"){
  find_booking.rejected_time = time
  await find_booking.save()
}
if(status=="paid"){
  find_booking.paid_time = time
  await find_booking.save()
}
if(status=="completed"){
  find_booking.completed_time = time
  await find_booking.save()
}

    if(discounted_price){
      find_booking.discounted_amount = discounted_price;
      await find_booking.save();
    }

    const  user = await User.findByPk(find_booking.UserId)
    const expert= await User.findByPk(find_booking.expert_id)

    const find_service = await service.findByPk(find_booking.serviceId)
    const service_name = find_service.serviceName

    const expert_name = expert.name

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
        body: `Dear ${user.name}, your service request for ${service_name} with Booking ID : ${booking_id}`,
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
      UserId :user.id
    });

    fcm.send(message, function(err, response) {
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

    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.update_Booking_by_payment_status = async (req, res) => {
  try {
    const { payment_status ,booking_id ,time} = req.body;

  
    if (!payment_status) {
      return res.status(400).json({ error: "please do not give empty fileds" });
    }
 
    const update_payment_status = await Booking_details.update( 
       
      {
        payment_status: payment_status,
      },
      {
        where: {
          id:booking_id,
          payment_status:"unpaid"
        },
      }
    );


    const find_booking = await Booking_details.findByPk(booking_id)
    const  user = await User.findByPk(find_booking.UserId)
    const expert= await User.findByPk(find_booking.expert_id)

    const find_service = await service.findByPk(find_booking.serviceId)
    const service_name = find_service.serviceName

    find_booking.paid_time =time;
    await find_booking.save();
  
    //console.log(expert)
    const user_name= user.name;
    const expert_name = expert.name

    var message = {
      to: expert.device_id, // Assuming the user model has a device_id field
      notification: {
        title: `Payment Confirmation`,
        body: `Booking service for ${service_name} of Rs.${find_booking.discounted_amount} is ${payment_status} by ${user_name}.`,
      }, 
    }

    await Notification.create({
      message: message.notification.body,
      type: " payment_status ",
      UserId :expert.id
    });

    fcm.send(message, function(err, response) {
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




exports.getAllBookingdataForAll = async(req, res) => {

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
          attributes:['id','status','payment_status', 'createdAt'],
        include: [
          {
            model: User,
            as: "User",
            where: { id: Sequelize.col('booking_detail.UserId') },
            attributes : ['id', 'name', 'phone_no', 'user_type'],
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
  
      const totalCount = await Booking_details.count({});
      const totalPages = Math.ceil(totalCount / limit);
  
      const bookingStatusForPending = await Booking_details.findAndCountAll({
        where : {
          status : 'pending'
        }
      })
      const bookingStatusForApproved = await Booking_details.findAndCountAll({
        where : {
          status : 'approved'
        }
      })
      const bookingStatusForReject = await Booking_details.findAndCountAll({
        where : {
          status : 'reject'
        }
      })
          const users = await User.findAll({query,
            attributes : ['id', 'name', 'phone_no', 'user_type'],
          });
          
        
      return res.status(200).json({
        status: true,
        message: "All Booking",
        bookingStatusForPending:bookingStatusForPending.count || 0,
        bookingStatusForApproved: bookingStatusForApproved.count || 0,
        bookingStatusForReject:bookingStatusForReject.count || 0,
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
