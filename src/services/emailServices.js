//  require("dotenv").config();
// const nodemailer = require("nodemailer");
// const ejs = require("ejs");
// const path = require("path");
// const emailService = async (data) => {

//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       requireTLS: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });
//     return new Promise((resolve, reject) => {
//       const url = `${data.forgot_url}`;
//       ejs.renderFile(
//         path.join(__dirname, "../../views/email.ejs"),
//         { url },
//         (err, res) => {
//           if (err) {
//             console.log(err);
//           }

//           const message = {
//             from: "legalcare forgot password", // from
//             to: data.email, // user email
//             subject: data.subject, // email subject
//             html: res,
//           };
//           transporter.sendMail(message, (error, info) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(info.response);
//             }
//           });
//         }
//       );
//     });
//   } catch (error) {
//     console.log("Error sending email:", error);
//   }
// };

// module.exports = emailService;


require("dotenv").config();
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const emailService = async (otp, name, email, yourName,yourPosition,yourCompany) => {

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
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
        path.join(__dirname, "../../views/email_templets/new-email.ejs"),
        {code:otp, name:name, email:email, yourName:yourName, yourPosition:yourPosition, yourCompany:yourCompany },
        (err, res) => {
          if (err) {
            console.log(err);
          }
          
          const message = {
            from: process.env.sendMailer, // from
            to:email , // user email
            subject: "OTP Verification Mail for LynKlegal", // email subject
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
