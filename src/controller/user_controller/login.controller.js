const db = require("../../../config/db.config");
const User = db.User;
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const moment = require("moment");
// const twilio = require("twilio");
// let accountSid = process.env.TWILIO_ACCOUNT_SID;
// let authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = new twilio(accountSid, authToken);
// const { validationResult } = require("express-validator");
// const { CallPage } = require("twilio/lib/rest/api/v2010/account/call");
// const { sendOtp } = require("../services/otpGenerate");
const tokenProcess = require("../../services/genrateToken");

exports.login = async (req, res) => {
  const { phone_no, password, device_token } = req.body;

  // Simple validation
  if (!phone_no || !password || !device_token) {
    return res.json({
      status: false,
      message: "Please provide phone number, password, and device token.",
    });
  }

  try {
    const user = await User.findOne({ where: { phone_no } });

    if (!user) {
      return res.status(200).json({
        status: false,
        message: "Login Failed, please check mobile number.",
      });
    }

    // Asynchronous password comparison
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(200).json({
        status: false,
        message: "Login Failed, please check password.",
      });
    }

    if (user.otp_verify === 0 || user.otp_verify === null) {
      const otp = Math.floor(100000 + Math.random() * 900000); // 6 digits OTP
      await User.update(
        { otp, device_id: device_token, login_from: "app" },
        { where: { phone_no } }
      );
      // await sendOtp(phone_no, otp);
      // await client.messages.create({
      //   from: process.env.from, // Use an environment variable
      //   to: process.env.to, // Send to the user's phone number
      //   body: `Your verification OTP is ${otp}`,
      // });

      return res.status(200).json({
        status: true,
        message:
          "Your OTP has not been verified yet. We have sent you a new OTP.",
      });
    } else {
      const access_token = tokenProcess.generateAccessToken(user);
      const refresh_token = tokenProcess.generateRefreshToken();
      const Refresh_token_expiration = Date.now() + 7 * 24 * 60 * 60 * 1000;

      user.refreshToken = refresh_token;
      user.refreshToken_Expiration = Refresh_token_expiration;
      await user.save();

      const brade = await User.update(
        {
          device_id: device_token,
          refreshToken :refresh_token,
          user_status: "Online",
          login_from: "app",
        },
        { where: { phone_no } }
      );

      const updatedUser = await User.findOne({ where: { phone_no } });
      res.cookie("refresh_token", refresh_token, { httpOnly: true });

      return res.status(200).json({
        status: true,
        data:updatedUser
        // id: updatedUser.id,
        // access_token: access_token,
        // user_type: updatedUser.user_type,
        // otp_verify: updatedUser.otp_verify,
        // is_free: updatedUser.free_redeem,
        // profile_image: `http://yourserver.com/images/profile_image/${updatedUser.profile_image}`,
        // name: updatedUser.name,
        // message: "success",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred during the login process.",
    });
  }
};
  