const db = require("../../../config/db.config");
const User = db.User;
const bcrypt = require("bcryptjs");
const Token = require("../../services/genrateToken")


exports.Admin_login = async (req, res) => {

    try {
        if (!req.body.email_id) {
            return res.status(400).json({ error: 'Please enter your email ' });
        }
        if (!req.body.password) {
            return res.status(400).json({ error: 'please enter your password' });
        }
        const user = await User.findOne({ where: { email_id: req.body.email_id } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        if(user.user_type === "1"){
            return res.status(401).json({ error: 'Unauthorized User' });
        }
        if(user.user_type === "0" || user.user_type === "2" || user.user_type === "3" || 
        user.user_type === "4"  ){
            
        
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const verifyEmail = await User.findOne({
            where: {
                is_verify: 1,
                email_id: req.body.email_id
            }
        })
        if (!verifyEmail) {
            res.status(400).json({ message: 'Please verify your email first then try to login' })
        }

        const access_token = Token.generateAccessToken(user)
        const refresh_token = Token.generateRefreshToken()
        const Refresh_token_expiration = Date.now() + (7 * 24 * 60 * 60 * 1000);

        user.refreshToken = refresh_token
        user.refreshToken_Expiration = Refresh_token_expiration
        await user.save()
        res.cookie("refresh_token", refresh_token, { httpOnly: true })

        return res.status(200).json({
            message: "Successfully login",
            data: user,
            access_token: access_token
        })
    }
    else{
        return res.status(403).json({
            message:"Access denied"
        })
    }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
          status: false,
          message: error.message,
        });
    }
}



