const db = require("../../../config/db.config");
const User = db.user;
const bcrypt = require("bcryptjs");

const tokenProcess = require("../../services/genrateToken");

exports.login = async (req, res) => {
  const { email_id, password,device_token} = req.body;

// Trimmed fields
const trimmedPassword = password.trim();
const trimmedEmail = email_id.trim();


  // Simple validation
  if (!email_id || !password) {
    return res.json({
      status: false,
      message: "Please provide Email_Id, password, device_token .",
    });
  }

  try {
    const user = await User.findOne({ where: { email_id : trimmedEmail} });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Login Failed, please check email id or password.",
      });
    }
    // Asynchronous password comparison
    const passwordIsValid = await bcrypt.compare(trimmedPassword, user.password);

    if (!passwordIsValid) {
      return res.status(200).json({
        status: false,
        message: "Login Failed, please check password.",
      });
    }

    // if (user.otp_verify == 0 || user.otp_verify == null) {
    //   const otp = Math.floor(100000 + Math.random() * 900000); // 6 digits OTP
    //   await User.update(
    //     {  device_token, login_from: "web" },
    //     { where: { email_id: trimmedEmail} }
    //   );
    
    //   return res.status(200).json({
    //     status: true,
    //     message:
    //       "Your OTP has not been verified yet. We have sent you a new OTP.",
    //       otp_verify : user.otp_verify
    //   });
    // } else {
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
          status: "verified",
          login_from: "web",
        },
        { where: { email_id : trimmedEmail} }
      );

      const updatedUser = await User.findOne({ where: { email_id :trimmedEmail} });
      res.cookie("refresh_token", refresh_token, { httpOnly: true });

      return res.status(200).json({
        status: true,
        data:updatedUser
       
      });
    // }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred during the login process.",
    });
  }
};
  