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

const categoryRoutes = require("./category_routes/add_category.routes");

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


module.exports = router