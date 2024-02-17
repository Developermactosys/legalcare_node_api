// controllers/userController.js
const db = require("../../../config/db.config");

const User = db.User;

const edit_user = async (req, res) => {
    const { id, device_id, name, phone_no, dob, address, blood_group, gender, country, zipcode, city, birth_time } = req.body;
    const profile_image = req.file;
  
    if (!id || !device_id) {
      return res.status(400).json({
        status: false,
        code: 201,
        message: "id and device_id are required",
        data: req.body,
      });
    }
  
    try {
      const user = await User.findByPk(id);
  
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "Data does not found!!!!!!!!!!!!",
        });
      }
  
      let imagePath = '';
      if (profile_image) {
        imagePath = `/uploads/images/${profile_image.filename}`;
      }
  
      await User.update({
        name: name || "Enter Name",
        phone_no: phone_no || "Enter Phone",
        dob: dob || "Enter DOB",
        address: address || "Enter Address",
        blood_group: blood_group || "Enter Blood Group",
        gender: gender || "Enter Gender",
        country: country || "Enter Country",
        zipcode: zipcode || "Enter Zipcode",
        city: city || "Enter City",
        birth_time: birth_time || "Enter BirthTime",
        ...(imagePath && { profile_image: imagePath })
      }, {
        where: { id: id },
      });
  
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
