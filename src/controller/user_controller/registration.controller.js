// controllers/UserController.js
const db = require("../../../config/db.config");
const secret_key = process.env.SECRET_KEY
const User = db.user;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { validationResult } = require('express-validator');


const registration = async (req, res) => {
  try {
    const {
      full_name,
      email_id,
      password,
      user_type,
      phone_no,
      confirm_password
    } = req.body;
    
    const isEmptyKey = Object.keys(req.body).some(key => {
      const value = req.body[key];
      return value === '' || value === null || value === undefined;
    });

    if (isEmptyKey) {
      return res.status(400).json({ error: "Please do not leave empty fields" });
    }
  
 // Trimmed fields
 const trimmedName = full_name.trim();
 const trimmedEmail = email_id.trim();
 const trimmedPassword = password.trim();
 const trimmedConfirmPass = confirm_password.trim();
 const trimmedPhoneNo = phone_no.trim();

  
if(!user_type){
  return res.status(400).json({status:false, message: "Please provide user_type"})
}
   

if (trimmedPassword !== trimmedConfirmPass) {
  return res.status(400).json({status:false, error: "Passwords is not match" });
}

// Check if the email already exists in the database
const existingUser = await User.findOne({ where: { email_id: trimmedEmail } });

if (existingUser) {
  return res.status(400).json({status:true, error: "Email already exists" });
}

const remember_token = jwt.sign({ email_id: trimmedEmail }, secret_key, { expiresIn: '7d' });

    if (!existingUser) {
     
      const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

      const user = await User.create({
      full_name : trimmedName,
      email_id : trimmedEmail,
      phone_no : trimmedPhoneNo,
      password : hashedPassword,
      user_type : user_type,
      remember_token : remember_token
    })

      if(req.file){
        const filePath = req.file
        ? `profile_image/${req.file.filename}`
        : "/public/uploads/profile_image/default.png";
        user.profile_image=filePath
        await user.save();
        }

      return res.status(200).json({
        status: true,
        message:
          "Registration successfully, send OTP to your registered number for verification",
        data: user,
      });
    } else {
      return res.json({
        status: false,
        message: "This Email is already exists",
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
      await User.update({ otp_verify: 1 , is_active: 1 }, { where: { phone_no: phone_no } });

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
            message: " User doesn't exist",
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
  return res.status(500).json({
      status: false,
      message: error.message,
  });
}
}



module.exports= {
  registration,otpVerify, store_otp
}