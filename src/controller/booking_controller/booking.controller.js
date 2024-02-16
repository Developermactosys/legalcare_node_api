// const { where } = require("sequelize");
const db = require("../../../config/db.config");
const Booking_details = db.booking_detail;

exports.Add_Booking = async (req, res) => {
  try {
    const { serviceId } = req.body;

    const isEmptykey = Object.keys(req.body).some((key) => {
      const value = req.body[key];
      return value === "" || value === null || value === undefined;
    });
    if (isEmptykey) {
      return res.status(400).json({ error: "please do not give empty fileds" });
    }
    const add_booking = await Booking_details.create(req.body);

    add_booking.serviceId = serviceId;

    await add_booking.save();

    return res.status(200).json({
      status: true,
      message: "Booking statusfull",
      data: add_booking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.get_booking_by_status = async (req, res) => {
  try {
    const { status } = req.body;
    const isEmptykey = Object.keys(req.body).some((key) => {
      const value = req.body[key];
      return value === "" || value === null || value === undefined;
    });
    if (isEmptykey) {
      return res.status(400).json({ error: "please do not give empty fileds" });
    }

    if (status === "pending") {
      const pending_booking = await Booking_details.findAll({
        where: {
          status: status,
        },
      });

      return res.status(200).json({
        status: true,
        message: "pending bookings",
        data: pending_booking,
      });
    }

    if (status === "reject") {
        const rejected_booking = await Booking_details.findAll({
          where: {
            status: status,
          },
        });
  
        return res.status(200).json({
          status: true,
          message: "rejected bookings",
          data: rejected_booking,
        });
    }

    if (status === "approved") {
        const approved_booking = await Booking_details.findAll({
          where: {
            status: status,
          },
        });
  
        return res.status(200).json({
          status: true,
          message: "pending bookings",
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
exports.getAll_bookings = async(req, res) => {
    try {
        const get_all_booking = await Booking_details.findAll()

        return res.status(200).json({
            status : true,
            message : "All Booking",
            data : get_all_booking
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

exports.Cancle_booking_by_id = async(req, res) => {
    try {
        const {booking_id}  = req.params
        const cancel_booking = await Booking_details.findByPk(booking_id)
        if(cancel_booking){
       await cancel_booking.destroy(cancel_booking)
        return res.status(200).json({
            status : true,
            message : "Booking delete Successfully"
        })
    }else{
        return res.status(400).json({
            status : false,
            message : "Booking Id not found or Booking not deleted"
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