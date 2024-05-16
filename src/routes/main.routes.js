const express = require("express")

const router = express.Router();

const userRoutes = require("./user_routes/user.routes");

router.use("/",userRoutes);


module.exports = router
