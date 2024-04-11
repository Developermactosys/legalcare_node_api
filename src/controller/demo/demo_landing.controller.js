const db = require("../../../config/db.config")
// const User = db.landing_user;
const User = db.User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailService = require("../../services/emailServices")
exports.createUser = async (req, res, next) => {
   
    const { name, last_name,  email, password, confirm_password,phone_no, } = req.body;

    try {
        const isEmptyKey = Object.keys(req.body).some(key => {
            const value = req.body[key];
            return value === '' || value === null || value === undefined;
        });

        if (isEmptyKey) {
            return res.status(200).json({ error: "Please do not leave empty fields" });
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        if (password !== confirm_password) {
            return res.status(200).json({ error: "Passwords do not match" });
        }
        
        const existingUser = await User.findOne({ where: { email_id: email } });
        const existingUserPhone_no = await User.findOne({ where: { phone_no: phone_no } });
        if (existingUser ) {
            return res.status(200).json({ error: "Email already exists" });
        }
        if(existingUserPhone_no){
            return res.status(200).json({ error: "Mobile number already exists" });
        }

        const hashedPassword = await bcrypt.hash(confirm_password, 10);

        const remember_token = jwt.sign({ email_id : email },process.env.ACCESS_SECRET_KEY, { expiresIn: '7d' });

        const newUser = await User.create({
            // first_name: name,
            name:name,
            last_name: last_name,
            email_id: email,
            phone_no:phone_no,
            password: hashedPassword,
            token: remember_token,
            confirm_password: confirm_password,
            otp:otp,
            user_type:2
        });
       if(newUser){
        // const info = await emailService(data);
          let yourName = 'LegalCare';
          let yourCompany = 'LegalCare';
          let yourPosition = 'Manager';
         
          const info= await emailService(otp, name,email, yourName, yourCompany, yourPosition);

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
        }}
        return res.status(400).json({
            status: false,
            message: "User not registered",
            
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg:error.message});
    }
};


exports.otp_Verify = async (req, res) => {
    try {
        const { id, otp } = req.body;
        // Check if user exists
        const checkuser =await User.findOne({ where: { id: id } });
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
