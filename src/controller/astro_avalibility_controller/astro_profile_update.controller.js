const db = require("../../../config/db.config")
const User = db.User;
const astro_availability = db.astro_availability;
const bcrypt = require('bcryptjs')

// API for astro_profile_update
exports.astro_profile_update = async (req, res) => {
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
    categoryName
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
    categoryName
    
  };

//   if (req.files["profile_image"]) {
//     updateData.profile_image = `/images/profile_image/${req.files["profile_image"][0].filename}`;
//   }

//   if (req.files["image_url"]) {
//     updateData.image_url = req.files["image_url"]
//       .map((file) => `/images/profile_image/cover_img/${file.filename}`)
//       .join("|");
//   }

  if (password) {
    updateData.password = bcrypt.hashSync(password, 10);
  }

  try {
    await User.update(updateData, { where: { id } });
   // const categoryUpdate = await category.update(updateData, { where : { id : id }})


    if (week_day && week_start_time && week_end_time) {
      const weekDays = week_day.split(",");
      const startTimes = week_start_time.split(",");
      const endTimes = week_end_time.split(",");

      for (let i = 0; i < weekDays.length; i++) {
        const [updated] = await astro_availability.upsert(
          {
            astro_id: id,
            days: weekDays[i],
            start_time: startTimes[i],
            end_time: endTimes[i],
          },
          {
            where: { astro_id: id, days: weekDays[i] },
          }
        );
      }
    }

    res.json({
      status: true,
      message: "User update successfully",
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating the user.",
    });
  }
};
