
require("dotenv").config();
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const emailService = async (bookingID, user_name, amount, payment_method, transaction_id, time, user_email) => {

  try {
    const transporter = nodemailer.createTransport({
       host: "smtp.sendgrid.net",
    //host:"smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    return new Promise((resolve, reject) => {
      
      ejs.renderFile(
        path.join(__dirname, "../../views/email_templets/payment_confirmation_email.ejs"),
        { bookingID: bookingID, user_name: user_name, amount: amount, payment_method: payment_method, transaction_id: transaction_id, time: time, user_email: user_email },
        (err, res) => {
          if (err) {
            console.log(err);
          }
          
          // let from = `Lynklegal <info@lynklegal.com>`
          let from = `Lynklegal ${process.env.sendMailer}`

          const message = {
            // from: process.env.sendMailer, // from
            from: from, // from
            to:user_email , // user email
            subject: `Payment Confirmation `,
            html: res,
          };
        
          transporter.sendMail(message, (error, info) => {
            if (error) {
              reject(error);
            } else {
              resolve(info.response);
            }
          });
        }
      );
    });
  } catch (error) {
    console.log("Error sending email:", error);
  }
};

module.exports = emailService;
