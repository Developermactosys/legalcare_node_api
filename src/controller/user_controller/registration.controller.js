// controllers/UserController.js
const db = require("../../../config/db.config");

const User = db.User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require('moment');
const twilio = require('twilio');
// const accountSid=process.env.TWILIO_ACCOUNT_SID;
// const authToken=process.env.TWILIO_AUTH_TOKEN;
// const client = new twilio(accountSid, authToken);
const { validationResult } = require('express-validator');
const { CallPage } = require("twilio/lib/rest/api/v2010/account/call");


const registration = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      user_type,
      phone_no,
      dob: userInputDate,
      birth_time,
      birth_place,
      device_id,
      device_token,
      address,
      sender_id,
      receiver_id,
    } = req.body;

    const dateFormat = "DD-MM-YYYY";
    const parsedDate = moment(userInputDate, dateFormat, true);

    if (!parsedDate.isValid()) {
      return res.status(400).json({
        status: false,
        message: "The provided date is invalid. Please use DD-MM-YYYY format.",
      });
    }

    const existingUser = await User.findOne({ where: { phone_no: phone_no } });

    if (existingUser) {
      return res.status(409).json({
        // 409 Conflict might be more appropriate for duplicate entries
        status: false,
        message: "This Phone Number already exists.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
    const filePath = req.file
    ? `profile_image/${req.file.filename}`
    : "/src/uploads/profile_image/default.png";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create(req.body);
    user.password = hashedPassword,
    user.dob = parsedDate.format("DD-MM-YYYY"), // Use the formatted and validated date
    user.profile_image = filePath,
    await user.save();
 

    return res.json({
      status: true,
      message:
        "Registration successful. OTP sent to your registered number for verification.",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};


// API for verify otp
const otpVerify = async (req, res) => {
  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({
          status: false,
          code: 201,
          message: errors.array()[0].msg, // Send first error message
          data: req.body,
      });
  }

  try {
      const { id, otp } = req.body;
      // Check if user exists
      const checkuser = await User.findOne({ where: { id: id } });

      if (!checkuser) {
          return res.json({
              status: false,
              message: "Your user id or token does not matched",
          });
      }

      // Verify OTP
      const checkotps = await User.findOne({
          where: {
              id: id,
              otp: otp,
          },
      });

      if (!checkotps) {
          return res.json({
              status: false,
              message: "Otp does not matched",
          });
      }

      // Update user as verified
      await User.update({ otp_verify: 1 }, { where: { id: id } });

      // Respond with user details
      return res.json({
          status: true,
          id: checkotps.id,
          user_type: checkotps.user_type,
          profile_image: `${req.protocol}://${req.get('host')}/images/profile_image/${checkotps.profile_image}`,
          name: checkotps.name,
          email_id: checkotps.email_id,
          is_free: checkotps.free_redeem,
          message: "Otp successfully verified",
      });
  } catch (error) {
      console.error('OTP Verification Error:', error);
      return res.status(500).json({
          status: false,
          message: "Internal Server Error",
      });
  }
};


module.exports= {
  registration,otpVerify
}