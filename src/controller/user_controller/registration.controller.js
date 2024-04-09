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
const { cached } = require("sqlite3");

const registration = async (req, res) => {
  try {
    const {
      name,
      email_id,
      password,
      user_type,
      phone_no,
      dob : userInputDate,
      birth_time,
      birth_place,
      device_id,
      device_token,
      address,
    } = req.body;

    const dateFormat = "YYYY-MM-DD"; 
    const parsedDate = moment(userInputDate, dateFormat);
    
if(!user_type){
  return res.status(200).json({status:true, message: "Please provide user_type"})
}
    if (!parsedDate.isValid()) {
      console.error("The provided date is invalid.");
    } else {
      // Proceed with your database insertion logic
      const formattedDateForDB = parsedDate.format("YYYY-MM-DD");
      // Use `formattedDateForDB` in your INSERT statement for the `dob` column
    }
    const existingUser = await User.findOne({ where: { phone_no: phone_no } });

    if (!existingUser) {
     
      // const filePath = `/src/uploads/${req.file.filename}`;
      // console.log(filePath);

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create(req.body);
      user.dob = userInputDate,
      
      user.password= hashedPassword,
      user.user_type =  user_type
      await user.save();

      if(req.file){
        const filePath = req.file
        ? `profile_image/${req.file.filename}`
        : "/src/uploads/profile_image/default.png";
        user.profile_image=filePath
        await user.save();

        }
  
  
      return res.json({
        status: true,
        message:
          "Registration successfully, send OTP to your registered number for verification",
        data: user,
      });
    } else {
      return res.json({
        status: false,
        message: "This Phone Number already exists",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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
      const { phone_no, otp } = req.body;
      // Check if user exists
      const checkuser = await User.findOne({ where: { phone_no: phone_no } });

      if (!checkuser) {
          return res.json({
              status: false,
              message: "Your user phone_no or token does not matched",
          });
      }

      // Verify OTP
      const checkotps = await User.findOne({
          where: {
              phone_no: phone_no,
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
      await User.update({ otp_verify: 1 }, { where: { phone_no: phone_no } });

      // Respond with user details
      return res.json({
          status: true,
          id:checkotps.id,
          phone_no: checkotps.phone_no,
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


// store otp 
const store_otp = async(req, res) => {
  try {
    const { phone_no, otp } = req.body;
    // Check if user exists
    const checkuser = await User.findOne({ where: { phone_no: phone_no } });

    if (!checkuser) {
        return res.json({
            status: false,
            message: "Your user id or token does not matched",
        });
    }
    if(!otp){
      return res.json({
        status: false,
        message: "please fill otp",
    });

    }

    // store OTP
    const store_otp_db = await User.update(
     {otp : otp},{
        where: {
          phone_no: phone_no,
           
        }
      }
    );

    res.status(200).json({
      status : true, 
      message : "OTP stored successfully"
    })
}catch (error) {
  console.error('OTP store Error:', error);
  return res.status(500).json({
      status: false,
      message: "Internal Server Error",
  });
}
}



module.exports= {
  registration,otpVerify, store_otp
}