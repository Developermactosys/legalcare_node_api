const db = require("../../../config/db.config");
const User = db.User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const emailService = require("../../services/emailServices");

exports.forgotPassword = async (req, res) => {
    if (!req.body.email) {
      return res.json({ message: "email is required" });
    }

    try {
      const user = await User.findOne({
        where: { email_id: req.body.email },
      });
      if (!user) {
        return res.json({ message: "email is not found" });
      }
      const token = jwt.sign({ id: user.id }, "jwt_secret_key", {
        expiresIn: "10m",
      });
  
      if (req.body.email) {
        const createToken = await User.update(
          { remember_token: token },
          { where: { email_id: user.email_id } }
        );
        const data = {
          forgot_url: `${process.env.CLIENT_URL}/resetPassword/${token}`,
          email: user.email_id,
          subject: " forgot password",
        };
        const info = await emailService(data);
        if (info) {
          return res.json({
            status: true,
            message: "Forgot Password Link Send your E-mail",
            verificationLink: data.forgot_url,
          });
        }
        return res.json({ message: "failed to forgot password" });
      } else {
        return res.json({ message: "email is not found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  };
  
  exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) {
      return res.json({ message: "password required" });
    }
    try {
      jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if (err) {
          return res.json({ status: false, message: "wrong and expires token" });
        } else {
          bcrypt
            .hash(password, 10)
            .then((hash) => {
              User.update(
                { password: password, remember_token: null },
                { where: { remember_token: token } }
              )
                .then((u) =>
                  res.json({
                    status: true,
                    message: "password update successfully",
                  })
                )
                .catch((err) =>
                  res.json({
                    status: false,
                    message: "failed to update password",
                  })
                );
            })
            .catch((err) =>
              res.json({ status: false, message: "something went wrong" })
            );
        }
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  };