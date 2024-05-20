const db = require("../../../config/db.config");
const academic_tutor = db.acedemic_tutor;


const add_tutor = async (req,res) =>{
    try{
const {first_name,last_name,email_id,phone_no,brief_intro } = req.body;
const {academic_tutor_image}=req.files;

// Check if the email already exists in the database
const existingTutor = await academic_tutor.findOne({ where: { email_id: email_id } });

if (existingTutor) {
  return res.status(400).json({status:true, error: "Tutor already exists" });
}

const new_tutor = await academic_tutor.create({
    first_name:first_name,
    last_name:last_name,
    email_id:email_id,
    phone_no:phone_no,
    brief_intro:brief_intro
})

if(req.file){
    const filePath = req.file
    ? `academic_tutor_image/${req.file.filename}`
    : "/public/uploads/academy/default.png";
    user.academic_tutor_image=filePath
    await user.save();
    }

  return res.status(200).json({
    status: true,
    message:"Academic Tutor Added successfully",
    data: new_tutor,
  });
}
catch(error){
        return res.status(500).json({
            status: false,
            message: error.message,
          });
    }
}

module.exports ={add_tutor}