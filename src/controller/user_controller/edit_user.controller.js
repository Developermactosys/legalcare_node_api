// controllers/userController.js
const { where } = require("sequelize");
const db = require("../../../config/db.config");

const User = db.User;
const wallet_system = db.wallet_system

// const edit_user = async (req, res) => {
  
//     try {
//       const { id, device_id, name, phone_no, dob, address, blood_group, gender, country, zipcode, city, birth_time,email_id ,user_type} = req.body;
//       const profile_image = req.file;
    
//       if (!id || !device_id) {
//         return res.status(200).json({
//           status: false,
//           code: 201,
//           message: "id and device_id are required",
//           data: req.body,
//         });
//       }
//       const user = await User.findByPk(id);

//     if(phone_no != user.phone_no || email_id != user.email_id || user_type != user.user_type){
//       return res.status(200).json({
//         status:false , 
//         message: "Phone Number, Email Id and User type can not be editable"
//       })
//     }

  
//       if (!user) {
//         return res.status(200).json({
//           status: false,
//           message: "Data does not found!!!!!!!!!!!!",
//         });
//       }
  
    

//       const updateUser =  await User.update(req.body, {
//         where: { id: id },
//       });
//   if(req.file){
//     const imagePath = req.file
//       ? `profile_image/${req.file.filename}`
//       : "/src/uploads/profile_image/default.png";
//       user.profile_image = imagePath
//       await user.save()
      
//   }
//       res.json({
//         status: true,
//         message: "Data Update Successfully",
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         status: false,
//         message: "An error occurred while updating the data.",
//       });
//     }
//   };

const edit_user = async (req, res) => {
  try {
    const { id, device_id, phone_no, email_id, user_type, ...updateData } = req.body;
    const profile_image = req.file;

    if (!id || !device_id) {
      return res.status(200).json({
        status: false,
        code: 201,
        message: "id and device_id are required",
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(200).json({
        status: false,
        message: "User data not found.",
      });
    }

    // Check if phone_no, email_id, and user_type are being updated
    if (
      phone_no !== user.phone_no ||
      email_id !== user.email_id ||
      user_type !== user.user_type
    ) {
      return res.status(200).json({
        status: false,
        message: "Phone Number, Email Id, and User type cannot be edited.",
      });
    }

    // Update other fields except phone_no, email_id, and user_type
    const updateUser = await User.update(updateData, {
      where: { id: id },
    });

    // Update profile image if provided
    if (profile_image) {
      const imagePath = `profile_image/${profile_image.filename}`;
      user.profile_image = imagePath;
      await user.save();
    }

    res.status(200).json({
      status: true,
      message: "Data Updated Successfully",
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
      include:[
        {
          model:wallet_system,
          as:"wallet_system",
          attributes:["wallet_amount"]
        }
      ]
  
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
