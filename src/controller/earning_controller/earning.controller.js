const Sequelize = require("sequelize");
const db = require("../../../config/db.config")
const TransactionHistory = db.transaction_history;
const User = db.User;



exports.get_earning_by_userType = async(req, res) =>{
  try {
    const { user_type } = req.query;
    const findUser = await TransactionHistory.findAll({
        where : {
            user_type: user_type
        },
        include:[
        {
            model:User,
            as:"User",
            attributes:['id','user_type','name','profile_image']
        }
    ],
      })
    if(findUser){
        return res.status(200).json({
          status : true,
          message : "get data successfully",
          data:findUser
        })
    }else{
      return res.status(404).json({
        status : false,
        message : "data not found "
      })
    }
  } catch (error) {
    return res.status(500).json({
      status : false,
      message : error.message
    })
  }
}
