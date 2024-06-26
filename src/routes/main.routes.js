const express = require("express")

const router = express.Router();

const bankRoutes = require("./bank_routes/bank.routes")
const callRoutes = require("./call_routes/call.routes");
const chatRoutes = require("./chat_routes/chat.routes");
const checkRoutes = require("./check_exists/check.routes")
const feedbackRoutes = require("./feedback_routes/feedback.routes");
const listRoutes = require("./list_routes/list.routes");
const queryRoutes = require("./query_routes/query.routes");
const requestRoutes = require("./request_routes/request.routes");
const staticRoutes = require("./static_routes/static.routes");
const userRoutes = require("./user_routes/user.routes");
const walletRoutes = require("./wallet_routes/wallet.routes");
const astroRoutes = require("./astro_avalibility_routes/astro-avalibility.routes")
const categoryRoutes = require("./category_routes/category.routes");
const ratingRoutes = require("./rating_routes/rating.routes");
const bookingRoutes = require("./booking_routes/booking.routes");
const serviceRoutes =  require("./service_routes/service.routes")
const refreshTokenRoutes = require("./refreshToken_routes/refreshToken.routes");
const testimonialRoutes = require("./testimonial_routes/testimonial.routes")
const reviewRoutes = require("./review_routes/review.routes");
const message_imageRoutes = require("./message_image_routes/message_image.routes");
// Admin
const adminRoutes = require("./admin_routes/admin.routes");
const bannerRoutes = require("./admin_routes/banner_routes/banner.routes")
const adminDashboardRoutes = require("./admin_routes/admin_dashboard/todays.routes");
const Your_channel = require('./agora_routes/channel.route');
//Document
const documentRoutes = require("./document_routes/document.routes")
const videoRouter = require("./video_routes/video_routes")
//Notification
const notificationRoutes = require("./notification_routes/notification.routes")
// CA 
const caRoutes = require("./ca_routes/ca.routes")
//payment_History 
const payment_HistoryRoutes = require("./admin_routes/admin_dashboard/payment_history.routes")
const expertService = require('./expert_service_routes/expert_service.routes')
//setting 
const settingRoutes = require("./setting_routes/setting.routes");
//demo
const demo_landingRoutes = require("./demo/demo_landing.routes")

const earningRoutes = require("./earning_routes/earning.routes")



router.use('/', Your_channel);
router.use("/",bankRoutes);
router.use("/",callRoutes);
router.use("/",chatRoutes);
router.use("/",checkRoutes);
router.use("/",feedbackRoutes);
router.use("/",listRoutes);
router.use("/",queryRoutes);
router.use("/",requestRoutes);
router.use("/",staticRoutes);
router.use("/",userRoutes);
router.use("/",walletRoutes);
router.use("/",astroRoutes);
router.use("/",categoryRoutes);
router.use("/",ratingRoutes);
router.use("/",bookingRoutes);
router.use("/",serviceRoutes);
router.use("/",refreshTokenRoutes);
router.use("/",testimonialRoutes);
router.use("/",reviewRoutes);
router.use("/",message_imageRoutes)
//Admin
router.use("/",adminRoutes);
router.use("/",bannerRoutes);
router.use("/",adminDashboardRoutes);
//Document
router.use("/",documentRoutes);
router.use('/', videoRouter)
router.use('/',notificationRoutes);
//CA
router.use("/",caRoutes);
//paymet_History 
router.use("/",payment_HistoryRoutes);
//expert service route
router.use('/', expertService)
//settingRoutes
router.use("/",settingRoutes);
//demo
router.use("/",demo_landingRoutes);

router.use("/",earningRoutes);


module.exports = router
