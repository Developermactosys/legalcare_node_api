// const { where } = require("sequelize");
const { where,Sequelize } = require("sequelize");
const db = require("../../../config/db.config");
const Booking_details = db.booking_detail;
const service = db.service;
const User = db.User;

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
const serverKey = process.env.SERVER_KEY; // Replace this with your actual FCM server key
const fcm = new FCM(serverKey);


exports.Add_Booking = async (req, res) => {
  try {
    const { serviceId, discounted_amount, GST, user_id ,device_id} = req.body;

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
      token: expert.device_id, // Assuming the user model has a device_id field
      notification: {
        title: `Booking Confirmation`,
        body: `Booking for service  ${service_name} is confirmed by ${user_name}.`,
      },
      data: {
        // Custom data
        bookingId: add_booking.id.toString(),
        // Add more data as needed
      }
    }
    // {
    //   token: user.device_id, // Assuming the user model has a device_id field
    //   notification: {
    //     title: `Booking Confirmation`,
    //     body: `Your booking for service  ${service_name} is confirmed for the expert ${expert_name}.`,
    //   },
    //   data: {
    //     // Custom data
    //     bookingId: add_booking.id.toString(),
    //     // Add more data as needed
    //   }
    // }
  

    fcm.send(message, function(err, response) {
      if (err) {
          console.log("Something went wrong!", err);
          return res.status(400).json({
            success : false,
            message : err.message
          })
      } else {
          console.log("Successfully sent with response: ", response);
          // Proceed with your response
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

exports.update_Booking_by_status = async (req, res) => {
  try {
    const { status ,booking_id } = req.body;

  
    if (!status) {
      return res.status(400).json({ error: "please do not give empty fileds" });
    }

    const add_booking = await Booking_details.update( 
      {
        status: status,
      },
      {
        where: {
          id:booking_id,
          // payment_status:"paid"
        },
      }
    );

    const  user = await User.findByPk(add_booking.UserId)
    const expert= await User.findByPk(add_booking.expert_id)
    const expert_name = expert.name

    var message = {
      token: user.device_id, // Assuming the user model has a device_id field
      notification: {
        title: `Booking Confirmation`,
        body: `Booking for service  ${service_name} is made ${status} by ${expert_name}.`,
      },
      data: {
        // Custom data
        bookingId: add_booking.id.toString(),
        // Add more data as needed
      }
    }
   
  

    fcm.send(message, function(err, response) {
      if (err) {
          console.log("Something went wrong!", err);
          return res.status(500).json({ success: false, message: err.message });
      } else {
          console.log("Successfully sent with response: ", response);
          // Proceed with your response
          return res.status(200).json({
              status: true,
              message: "Booking status updated and notification sent",
              data: add_booking,
          });
      }
  });

    return res.status(200).json({
      status: true,
      message: "Updated successfully",
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

    const add_booking = await Booking_details.update( 
       
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

    return res.status(200).json({
      status: true,
      message: "Payment_Status Updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
