// const { where } = require("sequelize");
const { Sequelize } = require("sequelize");
const db = require("../../../config/db.config");
const Booking_details = db.booking_detail;
const service = db.service;
const User = db.User;
const Notification = db.notification;
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


exports.Add_Booking = async (req, res) => {
  try {
    const { serviceId, discounted_amount, GST, user_id } = req.body;

    const isEmptykey = Object.keys(req.body).some((key) => {
      const value = req.body[key];
      return value === "" || value === null || value === undefined;
    });
    if (isEmptykey) {
      return res.status(400).json({ error: "please do not give empty fields" });
    }
    const add_booking = await Booking_details.create(req.body);

    const find_service = await service.findByPk(serviceId)
    const service_name = find_service.serviceName

    add_booking.serviceId = serviceId;
    add_booking.discounted_amount = discounted_amount;
    add_booking.GST = GST;
    add_booking.UserId = user_id;
    add_booking.expert_id = find_service.UserId;

    await add_booking.save();
    
    const expert_id = find_service.UserId

    const user = await User.findByPk(user_id)
    const user_name =  user.name
    const expert = await User.findByPk(expert_id) 
    const expert_name = expert.name
   
    var message = {
      to: expert.device_id, // Assuming the user model has a device_id field
      notification: {
        title: `Booking Confirmation`,
        body: `Dear ${expert_name} you have received a service request from ${user_name} for ${service_name} with Booking ID ${add_booking.id}.`,
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
        return res.status(400).json({ success: false, message: "Failed to send notification" });
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
      return res.status(400).json({ error: "please do not give empty fileds" });
    }

    if (status === "pending") {
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
            model: service,
            as: "service",
            include: [
              {
                model: User,
                as: "User",
                where: { id: Sequelize.col('service.UserId') } // Here, we specify the association between the User model and the service model using the UserId from the service object
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
    }

    if (status === "reject") {
      const rejected_booking = await Booking_details.findAll({
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
            model: service,
            as: "service",
            include: [
              {
                model: User,
                as: "User",
                where: { id: Sequelize.col('service.UserId') } // Here, we specify the association between the User model and the service model using the UserId from the service object
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json({
        status: true,
        message: "rejected bookings",
        data: rejected_booking,
      });
    }

    if (status === "approved") {
      const approved_booking = await Booking_details.findAll({
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
            model: service,
            as: "service",
            include: [
              {
                model: User,
                as: "User",
                where: { id: Sequelize.col('service.UserId') } // Here, we specify the association between the User model and the service model using the UserId from the service object
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],

      });

      return res.status(200).json({
        status: true,
        message: "approved bookings",
        data: approved_booking,
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

// get all Bookings 
exports.getAll_bookings = async (req, res) => {
  try {

    const get_all_booking = await Booking_details.findAll({
      include: [
        {
          model: User,
          as: "User",
          where: { id: Sequelize.col('booking_detail.UserId') }
        },
        {
          model: service,
          as: "service",
          include: [
            {
              model: User,
              as: "User",
              where: { id: Sequelize.col('service.UserId') } // Here, we specify the association between the User model and the service model using the UserId from the service object
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
    })

    return res.status(200).json({
      status: true,
      message: "All Booking",
      data: get_all_booking
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
      
        {
          model: service,
          as: "service",
          include: [
            {
              model: User,
              as: "User",
              where: { id: Sequelize.col('service.UserId') } // Here, we specify the association between the User model and the service model using the UserId from the service object
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
        
          {
            model: service,
            as: "service",
            include: [
              {
                model: User,
                as: "User",
                where: { id: Sequelize.col('service.UserId') } // Here, we specify the association between the User model and the service model using the UserId from the service object
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

// Cancle Booking 
exports.Cancle_booking_by_id = async (req, res) => {
  try {
    const { booking_id } = req.params
    const cancel_booking = await Booking_details.findByPk(booking_id)
    if (cancel_booking) {


      const  user = await User.findByPk(cancel_booking.UserId)
      const expert= await User.findByPk(cancel_booking.expert_id)
  
      const find_service = await service.findByPk(cancel_booking.serviceId)
      const service_name = find_service.serviceName
  
  
      //console.log(expert)
      const user_name = user.name;
 
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

     const delete_booking = await cancel_booking.destroy(cancel_booking)
  
      fcm.send(message, function(err, response) {
        if (err) {
            console.error("Something went wrong!", err);
            return res.status(400).json({ success: false, message: err.message });
        } else {
            console.log("Successfully sent with response: ", response);
            // Proceed with your response
            return res.status(200).json({
                status: true,
                message: "Booking is cancelled and notification sent",
                data: delete_booking,
            });
        }
    });

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

exports.update_Booking_by_status = async (req, res) => {
  try {
    const { status ,booking_id, discounted_amount } = req.body;

  
    if (!booking_id) {
      return res.status(400).json({ error: "please do not give empty fileds" });
    }
    
    console.log(status, discounted_amount)

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
      message.notification.body += ` has got an offer ${discounted_price} by ${expert_name}.`;
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
    const { payment_status ,booking_id } = req.body;

  
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

  
    //console.log(expert)
    const user_name= user.name;
    const expert_name = expert.name

    var message = {
      to: expert.device_id, // Assuming the user model has a device_id field
      notification: {
        title: `Payment Confirmation`,
        body: `Booking service for ${service_name} is ${payment_status} by ${user_name}.`,
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
