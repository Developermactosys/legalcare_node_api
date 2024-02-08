// controllers/userController.js
const db = require("../../../config/db.config");

const User = db.User;

async function updateUser(req, res) {
    try {
        const { 
            id,
            name,
            email_id,
            password,
            user_type,
            phone_no,
            dob,
            birth_time,
            birth_place,
            device_id,
            device_token,
            address
        } = req.body;

        const update = {
            id,
            name,
            email_id,
            password,
            user_type,
            phone_no,
            dob,
            birth_time,
            birth_place,
            device_id,
            device_token,
            address
        };

       // Handle file upload for 'image_url'
       if (req.files && req.files.image_url) {
        const image_url = req.files.image_url[0]; // assuming single file upload
        update.image_url = `public\images/${time()}${image_url.originalname}`;
    }

    // Handle file upload for 'profile_image'
    if (req.files && req.files.profile_image) {
        const profile_image = req.files.profile_image[0]; // assuming single file upload
        update.profile_image = `public\images/${time()}${profile_image.originalname}`;
    }

        if (req.body.password !== undefined) {
            update.password = req.body.password;
        }

        await User.update(update, { where: { id } });

       

        res.json({
            status: true,
            message: 'User update successfully',
            data: [],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            code: 500,
            message: 'Internal Server Error',
            data: '',
        });
    }
}

module.exports = { updateUser };
