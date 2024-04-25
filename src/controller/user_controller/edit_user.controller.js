// controllers/userController.js
const { where } = require("sequelize");
const db = require("../../../config/db.config");

const User = db.User;

const edit_user = async (req, res) => {
    const { id, device_id, name, phone_no, dob, address, blood_group, gender, country, zipcode, city, birth_time,email_id ,user_type} = req.body;
    const profile_image = req.file;
  
    if (!id || !device_id) {
      return res.status(200).json({
        status: false,
        code: 201,
        message: "id and device_id are required",
        data: req.body,
      });
    }
  if(phone_no || email_id || user_type){
    return res.status(200).json({
      status:false , 
      message: "Phone Number, Email Id and User type can not be editable"
    })
  }
    try {
      const user = await User.findByPk(id);
  
      if (!user) {
        return res.status(200).json({
          status: false,
          message: "Data does not found!!!!!!!!!!!!",
        });
      }
  
    

      const updateUser =  await User.update(req.body, {
        where: { id: id },
      });
  if(req.file){
    const imagePath = req.file
      ? `profile_image/${req.file.filename}`
      : "/src/uploads/profile_image/default.png";
      user.profile_image = imagePath
      await user.save()
      
  }
      res.json({
        status: true,
        message: "Data Update Successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "An error occurred while updating the data.",
      });
    }
  };
  
 const view_user = async(req,res)=>{
  try {
    const {user_id , device_id} = req.body;
    const totalUsers = await User.findOne({
      where: {
        id: user_id,
        // device_id:device_id,
      },
  
    });
    if (totalUsers) {
      return res.status(200).json({
        status: true,
        message: "user retrieve Successfully",
        data: totalUsers,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

 
  module.exports = {
    edit_user,view_user
}
