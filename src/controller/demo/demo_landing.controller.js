const db = require("../../../config/db.config")
// const User = db.landing_user;
const User = db.User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailService = require("../../services/emailServices")


exports.createUser = async (req, res, next) => {
 
    try {
        const { name, last_name, email, password, confirm_password, phone_no ,login_from} = req.body;

        
 // Trimmed fields
 const trimmedName = name.trim();
 const trimmedLast_name = last_name.trim();
 const trimmedEmail = email.trim();
 const trimmedPassword = password.trim();
 const confirm_trimmedPassword = confirm_password.trim();
 const trimmedPhoneNo = phone_no.trim();

        const isEmptyKey = Object.keys(req.body).some(key => {
            const value = req.body[key];
            return value === '' || value === null || value === undefined;
        });
        let user_type;

        if (req.body.user_type !== undefined && req.body.user_type !== "") {
            user_type = req.body.user_type;
        } else {
            user_type = 2;
        }
        
        if (isEmptyKey) {
            return res.status(200).json({ status:false, message: "Please do not leave empty fields" });
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        if (trimmedPassword !== confirm_trimmedPassword) {
            return res.status(200).json({ status:false, message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ where: { email_id: trimmedEmail } });
        const existingUserPhone_no = await User.findOne({ where: { phone_no: trimmedPhoneNo } });
        if (existingUser) {
            return res.status(200).json({status:false, message: "Email already exists" });
        }
        if (existingUserPhone_no) {
            return res.status(200).json({status:false, message: "Mobile number already exists" });
        }

        const hashedPassword = await bcrypt.hash(confirm_trimmedPassword, 10);

        const remember_token = jwt.sign({ email_id: trimmedEmail }, process.env.ACCESS_SECRET_KEY, { expiresIn: '7d' });


        const newUser = await User.create({
            // first_name: name,
            name: trimmedName,
            last_name: trimmedLast_name,
            email_id: trimmedEmail,
            phone_no: trimmedPhoneNo,
            password: hashedPassword,
            token: remember_token,
            // confirm_password: confirm_password,
            otp: otp,
            user_type: user_type,
            login_from:login_from
        });
        if (newUser) {
            // const info = await emailService(data);
            let yourName = 'LegalCare';
            let yourCompany = 'LegalCare';
            let yourPosition = 'Manager';

            const info = await emailService(otp, trimmedName, trimmedEmail, yourName, yourCompany, yourPosition);

            if (info) {
                return res.json({
                    status: true,
                    message: "your registration successfully and link Sent on your E-mail",
                    user: {
                        id: newUser.id,
                        first_name: newUser.name,
                        last_name: newUser.last_name,
                        email_id: newUser.email_id,
                        phone_no: newUser.phone_no
                    }
                });
            }
        }
        return res.status(200).json({
            status: false,
            message: "User not registered",

        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({status : false, message: error.message });
    }
};


exports.otp_Verify = async (req, res) => {
    try {
        const { id, otp } = req.body;
        // Check if user exists
        const checkuser = await User.findOne({ where: { id: id } });
        //const existingUser = await User.findOne({ where: { email_id: email } });

        if (!checkuser) {
            return res.json({
                status: false,
                message: "Your id not found",
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
            message: "Otp successfully verified",
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};
