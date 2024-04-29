const { Op } = require("sequelize");
const db = require("../../../config/db.config");
const  User = db.User;
const bank_details = db.bank_details;
const  booking = db.booking_detail
const expert_service = db.expert_service

exports.getAllCa = async (req, res) => {
  try {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { user_type } = req.query;

  const whereCondition = {};

  if (user_type) {
    whereCondition.name = { [Op.like]: `%${user_type}%` };
  }
  const ca = await User.findAll({
    where: {
      user_type: 2,
    },
    where: whereCondition,
    offset: offset,
    limit: limit,
  });
  //   const totalCount = ca.length;
  const totalCount = await User.count({
    where: {
      user_type: 2,
    },
  });
  const totalPages = Math.ceil(totalCount / limit);
  if (!ca) {
    return res.json({ message: "Ca not found" });
  }
  const formattedCa = ca.map((ca) => {
    const originalDate = new Date(ca.createdAt); // Assuming the CA object has a 'date' field
    const year = originalDate.getFullYear().toString().slice(2);
    const month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
    const day = originalDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${day}/${month}/${year}`;

    return {
      id: ca.id,
      phone_no: ca.phone_no,
      is_verify: ca.is_verify,
      status: ca.new_status,
      date: formattedDate,
      last_seen: ca.last_seen,
    };
  });

  return res.status(200).json({
    status: true,
    data: formattedCa,
    totalPages,
    totalCa: totalCount,
    currentPage: page,
  });

  
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.caStatusUpdate = async (req, res) => {
  const caId = req.params.id;

  if (!caId) {
    return res.json({ message: "CA id required" });
  }

  try {
    const updatedCa = await User.update(
      { status: req.body.status },
      {
        where: {
          id: caId,
          user_type: 2,
        },
      }
    );

    if (updatedCa[0] === 0) {
      return res.json({ message: "No CA found with the provided ID" });
    }

    return res.status(200).json({
      success: true,
      message: "CA status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getByIdCa = async (req, res) => {
  const caId = req.params.id;

  try {
    const ca = await User.findOne({
      where: {
        id: caId,
        user_type: 2,
      },
    });

    if (!ca) {
      return res.json({ message: "CA not found with the provided ID" });
    }

    const {
      name,
      phone_no,
      gender,
      user_language,
      user_expertise,
      per_minute,
      user_experience,
      user_education,
      amount,
      user_rating,
      profile_image,
      user_status,
    } = ca;

    const responseData = {
      name,
      phone_no,
      gender,
      user_status,
      language: user_language,
      expertise: user_expertise,
      per_minute_charges: per_minute,
      experience: user_experience,
      education: user_education,
      wallet_amount: amount,
      star_rating: user_rating,
      profile_image_url: profile_image,
    };

    return res.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// when booking is pending then expert does not delatable 
exports.deleteCA = async (req, res) => {
  const caId = req.params.id;
  try {
       // Check if any booking has 'pending' status
       const bookingData = await booking.findAll({
        where: { expert_id: caId}
      });
  
       const hasPendingBooking = bookingData.some(booking => booking.status === 'pending');

       if (hasPendingBooking) {
         return res.status(200).json({
           status: false,
           message: "Cannot delete Expert due to pending bookings"
         });
       }
       // expert delete
    const deletedCA = await User.destroy({
      where: {
        id: caId,
        // user_type: 2,
      },
    });

    // Expert related services also delete 
const deleteExpert_services = await expert_service.destroy({
  where:{UserId: caId }
})

    if (deletedCA === 0) {
      return res.json({ message: "No Expert found with the provided ID" });
    }

    return res.status(200).json({
      success: true,
      message: "Expert and It's relevant services deleted successfully ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCA = async (req, res) => {
  const caId = req.params.id;

  try {
    const updatedCA = await User.update(req.body, {
      where: {
        id: caId,
        user_type: 2,
      },
    });

    if (updatedCA[0] === 0) {
      return res.json({ message: "No CA found with the provided ID" });
    }

    return res.status(200).json({
      success: true,
      message: "CA updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createCA = async (req, res) => {
  try {
    req.body.user_type = 2;

    const newCA = await User.create(req.body);

    return res.status(200).json({
      success: true,
      message: "CA created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getBankInfo = async (req, res) => {
  const caId = req.params.id;

  if (!caId) {
    return res.json({ message: "CA id required" });
  }

  try {
    const bankInfo = await bank_details.findOne({
      attributes: [
        "acc_holder_name",
        "acc_no",
        "bank_name",
        "ifsc_code",
        "pan_card_no",
        "aadhar_no",
      ],
      where: {
        astro_id: caId,
      },
    });

    if (!bankInfo) {
      return res.json({
        message: "Bank information not found for the provided CA ID",
        status: false,
      });
    }

    return res.json({
      status: true,
      data: bankInfo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.editBankInfo = async (req, res) => {
  const caId = req.params.id;
  try {
    const bankInfo = await bank_details.findOne({
      where: {
        astro_id: caId,
      },
    });

    if (!bankInfo) {
      return res.json({
        message: "Bank information not found for the provided CA ID",
      });
    }

    const updatedBankInfo = await bankInfo.update(req.body);

    return res.json({
      success: true,
      message: "Bank information updated successfully",
      data: updatedBankInfo,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
