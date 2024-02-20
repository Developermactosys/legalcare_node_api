const db = require("../../../config/db.config")
const User = db.User;
const astro_availability = db.astro_availability;
const bcrypt = require('bcryptjs')

// API for astro_profile_update
exports.astro_profile_update = async (req, res) => {
  try {

  const {
    id,
    name,
    dob,
    birth_time,
    birth_place,
    user_language,
    user_expertise,
    user_experience,
    gender,
    user_aboutus,
    per_minute,
    password,
    week_day,
    week_start_time,
    week_end_time,
    categoryName,
    profile_image
  } = req.body;

  if (!id) {
    return res.status(400).json({
      status: false,
      code: 201,
      message: "Id is required",
      data: req.body,
    });
  }

  let updateData = {
    name,
    dob,
    birth_time,
    birth_place,
    user_language,
    user_expertise,
    user_experience,
    gender,
    user_aboutus,
    per_minute,
    categoryName,
    profile_image
    
  };

  if (password) {
    updateData.password = bcrypt.hashSync(password, 10);
  }

const imagePath = req.file
      ? `profile_image/${req.file.filename}`
      : "/src/uploads/profile_image/default.png";
      
   
    await User.update(updateData, { where: { id : id} });
   // const categoryUpdate = await category.update(updateData, { where : { id : id }})

   if(req.file){
    const updateProfile = await User.update({profile_image:imagePath},{where:{
      id:req.body.id
    }})
  
  }

  if (week_day && week_start_time && week_end_time) {
    const weekDays = week_day.split(",");
    const startTimes = week_start_time.split(",");
    const endTimes = week_end_time.split(",");
  
    for (let i = 0; i < weekDays.length; i++) {
      const existingRecord = await astro_availability.findOne({
        where: { UserId: id, days: weekDays[i] }
      });
  
      if (existingRecord) {
        // Update existing record
        const updated = await astro_availability.update(
          {
            UserId: id,
            days: weekDays[i],
            start_time: startTimes[i],
            end_time: endTimes[i],
          },
          {
            where: { UserId: id, days: weekDays[i] },
          }
        );
      } else {
        // Create new record
        const created = await astro_availability.create({
          UserId: id,
          days: weekDays[i],
          start_time: startTimes[i],
          end_time: endTimes[i],
        });
      }
    }
  }
    res.json({
      status: true,
      message: "User update successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating the user.",
    });
  }
};
