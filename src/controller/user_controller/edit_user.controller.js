// controllers/userController.js
const { where } = require("sequelize");
const db = require("../../../config/db.config");

const User = db.user;

const edit_user = async (req, res) => {
  
    try {
      const { id,academy_name,teach_on,address,wilaya,commune,zipcode,brief_intro,last_name,country,
           first_name,timezone,notification,alternate_number,whatsapp_number,skype_id,website} = req.body;
           
      const {profile_image,document_for_tutor,document_for_academy} = req.files;
    
      if (!id ) {
        return res.status(201).json({
          status: false,
          message: "id is required",
        });
      }
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(200).json({
          status: false,
          message: "Data does not found!!!!!!!!!!!!",
        });
      }
user.academy_name = academy_name;
user.teach_on = teach_on;
user.address = address;
user.wilaya = wilaya;
user.commune = commune;
user.zipcode = zipcode;
user.brief_intro = brief_intro;
user.first_name = first_name;
user.last_name = last_name;
user.country = country;
user.timezone = timezone;
user.notification = notification;
user.alternate_number = alternate_number;
user.whatsapp_number = whatsapp_number;
user.skype_id = skype_id;
user.website = website;
await user.save();


      if (profile_image && profile_image[0]) {
        const imagePath = `profile_image/${profile_image[0].filename}`;
        user.profile_image = imagePath;
      await user.save();
      }
      
      if (document_for_academy && document_for_academy[0]) {
        const academyDocPath = `document_of_academy/${document_for_academy[0].filename}`;
        user.document_for_academy = academyDocPath;
      await user.save();

      }
  
      if (document_for_tutor && document_for_tutor[0]) {
        const tutorDocPath = `document_of_tutor/${document_for_tutor[0].filename}`;
        user.document_for_tutor = tutorDocPath;
      await user.save();

      }
      
  
     return res.status(200).json({
        status: true,
        message: "Data Update Successfully",
      });
    } catch (error) {
      console.error(error);
     return res.status(500).json({
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
        is_active: 1,
        status:"verified"
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
      return res.status(200).json({
        status: false,
        message: "User not found or it's Deactive or it's Suspended",
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
