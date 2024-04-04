const db = require("../../../config/db.config")
const User = db.landing_user;
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

        if (password !== confirm_password) {
            return res.status(200).json({ error: "Passwords do not match" });
        }
        
        const existingUser = await User.findOne({ where: { email_id: email } });

        if (existingUser) {
            return res.status(200).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(confirm_password, 10);

        const remember_token = jwt.sign({ email_id : email },process.env.ACCESS_SECRET_KEY, { expiresIn: '7d' });

        const newUser = await User.create({
            first_name: name,
            last_name: last_name,
            email_id: email,
            phone_no:phone_no,
            password: hashedPassword,
            token: remember_token,
            confirm_password: confirm_password
        });
       if(newUser){
        // const info = await emailService(data);
          let yourName = 'LegalCare';
          let yourCompany = 'LegalCare';
          let yourPosition = 'Manager';
          const otp = Math.floor(1000 + Math.random() * 9000).toString();
         
          const info= await emailService(otp, name,email, yourName, yourCompany, yourPosition);

        if (info) {
          return res.json({
            status: true,
            message: "your registration successfully and link Sent on your E-mail",
            list : newUser
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
