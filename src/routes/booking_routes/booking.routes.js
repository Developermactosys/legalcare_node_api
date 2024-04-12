const express = require('express');
const router = express.Router();
const {uploads} = require('../../middleware/multer');
// const { authorize } = require("../../middleware/authorization")


const { Add_Booking, getAll_bookings, get_booking_by_status, Cancle_booking_by_id , getAll_bookingsBySearch,get_bookings_by_user_id,update_Booking_by_status,update_Booking_by_payment_status, getAllBookingdataForAll,getBooking_by_status_only} = require("../../controller/booking_controller/booking.controller");

router.post('/add_booking',uploads.none(),Add_Booking); // Done

router.get('/get_all_booking', getAll_bookings)

router.post('/get_booking_by_status', uploads.none(), get_booking_by_status)

router.get('/get_booking_by_status_only',getBooking_by_status_only)

router.get('/get_bookings_by_user_id',get_bookings_by_user_id);

router.post('/update_booking_status',uploads.none(),update_Booking_by_status);

router.post('/update_Booking_by_payment_status',uploads.none(),update_Booking_by_payment_status);

router.post('/cancel_booking', Cancle_booking_by_id)

router.get('/get_all_booking_dashbroad', getAllBookingdataForAll)

router.get('/search_booking', getAll_bookingsBySearch)


module.exports = router;