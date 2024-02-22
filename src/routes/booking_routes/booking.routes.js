const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');


const { Add_Booking, getAll_bookings, get_booking_by_status, Cancle_booking_by_id , get_bookings_by_user_id} = require("../../controller/booking_controller/booking.controller");

router.post('/add_booking',uploads.none(),Add_Booking); // Done

router.get('/get_all_booking', getAll_bookings)

router.post('/get_booking_by_status', uploads.none(), get_booking_by_status)

router.get('/get_bookings_by_user_id',get_bookings_by_user_id);

router.delete('/cancel_booking/:booking_id', Cancle_booking_by_id)


module.exports = router;