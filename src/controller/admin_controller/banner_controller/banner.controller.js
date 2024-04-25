const db = require("../../../../config/db.config");
const { literal } = require("sequelize");
const LiveEvent = db.live_event;

// async function getBannerImages(req, res) {
//   try {
//     const validator = true; // Replace with actual validation logic if needed

//     if (!validator) {
//       const error_msg = "Validation failed"; // Replace with actual validation error message
//       const data = {
//         status: false,
//         code: 201,
//         message: error_msg,
//         data: req.body,
//       };
//       res.json(data);
//     } else {
//       const liveevents = await LiveEvent.findAll({
//         attributes: [
//           "id",
//           "banner_image",
//           [
//             literal(
//               'CONCAT("https://legalcare.mactosys.com/images/banner_image", "", banner_image)'
//             ),
//             "img_url",
//           ],
//         ],
//         where: {
//           page_type: 1,
//         },
//       });

//       if (liveevents.length > 0) {
//         const data = {
//           status: true,
//           live_events: liveevents,
//           message: "All events",
//         };
//         res.json(data);
//       } else {
//         const data = {
//           status: false,
//           message: "Data does not found",
//         };
//         res.json(data);
//       }
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }
// src\uploads\event_image
const addBanner = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.json({ message: "No fields provided in the request body" });
  }

  const { event_name, event_url, event_date } = req.body;
  try {
    const filePath = req.file
      ? `banner_image/${req.file.filename}`
      : "/src/uploads/banner_image/";
    const add_banner = await LiveEvent.create({
      event_name,
      event_date,
      banner_image: filePath,
      event_url,
    });
    if (!add_banner) {
      return res.json({
        success: false,
        message: "failed to create",
      });
    }
    return res.status(200).json({
      success: true,
      message: "banner add successfully....",
      data: add_banner,
    });
  } catch (error) {
    console.error(error);
   return res.status(500).json({ status:false, error: "Internal Server Error" });
  }
};

const editBanner = async (req, res) => {
 
  try {
    const { event_name, event_status, event_date } = req.body;

    const check = await LiveEvent.findOne({ where: { id: req.params.id } });

    if (!req.params.id) {
      return res.json({
        success: false,
        message: "No ID provided for the banner.",
      });
    }
    if (!check) {
      return res.json({
        status: false,
        message: "live event id not found",
      });
    }
 
      const ImgUpdate = await LiveEvent.update(
        {
          event_name:event_name,
          event_status:event_status,
          event_date:event_date,
        },
        {
          where: {
            id: req.params.id,
          },
        },
      );
    if (req.file) {
      const filePath = req.file
      ? `banner_image/${req.file.filename}`
      : "/src/uploads/banner_image/";
      check.banner_image = filePath
      await check.save()
    } 

    return res.status(200).json({
      status: true,
      message: "banner update successfully",
    });
  } catch (error) {
    console.error(error);
   return res.status(500).json({ status:false, error: "Internal Server Error" });
  }
};

const update_banner_status = async (req, res) => {
  try {
    const { event_status ,banner_id} = req.body;

    const check = await LiveEvent.findOne({ where: { id:banner_id } });

    if (!banner_id) {
      return res.json({
        success: false,
        message: "No ID provided for the banner.",
      });
    }
    if (!check) {
      return res.json({
        status: false,
        message: "live event id not found",
      });
    }

    const event_status_Update = await LiveEvent.update(
      {
        event_status: event_status,
      },
      {
        where: {
          id: banner_id,
        },
      },
    );

    return res.status(200).json({
      status: true,
      message: "event status updated successfully",

    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};


const deleteBanner = async (req, res) => {
  if (!req.params.id) {
    return res.json({
      message: "provide event id",
    });
  }
  try {
    const banner = await LiveEvent.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (banner > 0) {
      return res.json({
        success: true,
        message: "Banner deleted successfully",
      });
    }
    return res.status(404).json({
      success: false,
      message: "banner not found or already deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllBanner = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 4;
  const offset = (page - 1) * limit;
  try {
    const banner = await LiveEvent.findAll({
      where :{ event_status : "Active" },
      limit: limit,
      offset: offset,
    });
    if (!banner || banner.length <= 0) {
      return res.status(404).json({
        message: "Banner not found",
        status: false,
      });
    }
    const totalCount = await LiveEvent.count({});
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      message: "Banner get successfully",
      status: true,
      data: banner,
      totalBanner: totalCount,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllBanner,
  editBanner,
  addBanner,
  deleteBanner,
  update_banner_status
};
