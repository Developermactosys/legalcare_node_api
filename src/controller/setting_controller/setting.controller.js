const db = require("../../../config/db.config")
const theme = db.theme_setting
const foo = db.footer_section
const User = db.User;
const setting = db.admin_setting
const bcrypt = require('bcrypt') 
// API for setting admin for add
exports.settingAdmin = async (req, res) => {
   
    const { name, email, phone_no, city } = req.body;

    try {
        const isEmptyKey = Object.keys(req.body).some(key => {
            const value = req.body[key];
            return value === '' || value === null || value === undefined;
        });

        if (isEmptyKey) {
            return res.status(400).json({ error: "Please do not leave empty fields" });
        }

        
        const updatedUser = await User.update(
            { name, email_id:email, phone_no, city }, 
            { where: { id: 9, user_type:0 } } 
        );


        return res.status(200).json({
            status: true,
            message: "User information updated",
            data: updatedUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

// API for change password for admin
exports.changePassword = async(req, res)=>{
    const {password, confirm_password } = req.body;
    try {
        const findUser = await User.findOne({
            where : {
                id :9,
                user_type: 0
            }
        })
        if(findUser){
            if (password !== confirm_password) {
                return res.status(200).json({ error: "Passwords do not match" });
            }
            let hashedPassword = await bcrypt.hash(password, 10)
            const userData = await User.update({password: hashedPassword, confirm_password:hashedPassword},{where : {
                id : 9,
                user_type:0
            } })
            if(userData){
                return res.status(200).json({
                    status : true,
                    message : "password changed successfully",
                    data : userData
                })
            }else{
                return res.status(400).json({
                    status : true,
                    message : "password do not change",
                })
            }
        }else{
            return res.status(400).json({
                status : true,
                message : "admin not found",
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : true,
            message : error.message,
        })
    }
}


// API for change theme for admin
exports.changeTheme =async(req, res) =>{
    try {

        const fav_img = req.files['favicon_img'] && req.files['favicon_img'][0]
     ? `theme_images/${req.files['favicon_img'][0].filename}`
     : null;

     const logo_img = req.files['logo_img'] && req.files['logo_img'][0]
     ? `theme_images/${req.files['logo_img'][0].filename}`
     : null;
    

        const data = await theme.create({
            favicon_img :fav_img,
            logo_img,
        }) 
        if(data){
            return res.status(200).json({
                status : true,
                message: "Logo changed successfully",
                data : data
            })
        }else{
            return res.status(400).json({
                status : false,
                message : "logo not added"
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}

// API for footer setting for adming
exports.footerSetting = async(req, res)=> {
    const { description, address, contact_no, services} = req.body;
    try {
        const adminData = await foo.create({
     description, address, contact_no, services
        })
        if(adminData){
            return res.status(200).json
            ({
                status : true,
                message : "Details added successfully",
                data : adminData
            })
        }else{
            return res.status(400).json
            ({
                status : false,
                message : "Details are not added",
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}

exports.settingForAdmin = async(req, res)=>{
    const { user_name, password, api_key, payment_merchant_key,map_key, CA_api_user_id, cancelation_charges, CA_percentage} = req.body;
    try {
        const hashedPassword = await bcrypt.hashSync(password, 10)
        const data = await setting.create({
            user_name,password:hashedPassword,api_key,payment_merchant_key, map_key, CA_api_user_id,cancelation_charges,CA_percentage
        })
        if(data){
            return res.status(200).json({
                status : true,
                message : "setting add successfully",
                data: data
            })
        }else{
            return res.status(400).json({
                status : false,
                message : "setting not added"
            })
        }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}

// API for get admin setting details
exports.getAdminSetting = async(req, res)=>{
    try{
    const updatedUser = await User.findOne(
        { where: { id: 9, user_type:0 } } 
    );
    if(updatedUser){
        return res.status(200).json
        ({
            status : true,
            message : "show details",
            data :updatedUser
        })
    }
    }catch(error){
        return res.status(500).json({
            status: false,
            message : error.message
        })
    }
}

// API for otp_verify for landing page
exports.otp_Verify = async (req, res) => {
    try {
        const { id, otp } = req.body;
        // Check if user exists
        const checkuser =await User.findOne({ where: { id: id } });//const existingUser = await User.findOne({ where: { email_id: email } });
  
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
