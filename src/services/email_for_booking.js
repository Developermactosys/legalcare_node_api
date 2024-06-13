
require("dotenv").config();
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const emailService = async (bookingID, user_name, expert_name, service_name, find_service_cost,user_email) => {

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
        path.join(__dirname, "../../views/email_templets/booking_email.ejs"),
        {bookingID:bookingID, user_name:user_name, expert_name:expert_name, service_name:service_name, find_service_cost:find_service_cost ,user_email:user_email},
        (err, res) => {
          if (err) {
            console.log(err);
          }
          let from = `Lynklegal ${process.env.sendMailer}`
          
          const message = {
            // from: process.env.sendMailer, // from
            from:from,
            to:user_email , // user email
            subject: `Booking Confirmation: Your Booking ID ${bookingID}`,
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
