const db = require("../../../../config/db.config");
const { literal } = require("sequelize");
const LiveEvent = db.live_events;

async function getBannerImages(req, res) {
  try {
    const validator = true; // Replace with actual validation logic if needed

    if (!validator) {
      const error_msg = "Validation failed"; // Replace with actual validation error message
      const data = {
        status: false,
        code: 201,
        message: error_msg,
        data: req.body,
      };
      res.json(data);
    } else {
      const liveevents = await LiveEvent.findAll({
        attributes: [
          "id",
          "event_img",
          [
            literal(
              'CONCAT("https://legalcare.mactosys.com/images/event_img", "", event_img)'
            ),
            "img_url",
          ],
        ],
        where: {
          page_type: 1,
        },
      });

      if (liveevents.length > 0) {
        const data = {
          status: true,
          live_events: liveevents,
          message: "All events",
        };
        res.json(data);
      } else {
        const data = {
          status: false,
          message: "Data does not found",
        };
        res.json(data);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
// src\uploads\event_image
const addBanner = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.json({ message: "No fields provided in the request body" });
  }

  const { event_name, event_url, event_date } = req.body;
  try {
    const filePath = req.file
      ? `/src/uploads/event_image/${req.file.filename}`
      : "/src/uploads/event_image/";
    const add_banner = await LiveEvent.create({
      event_name,
      event_date,
      event_img: filePath,
      event_url,
    });
    if (!addBanner) {
      return res.json({
        success: false,
        message: "failed to create",
      });
    }
    return res.json({
      success: true,
      message: "banner add successfully....",
      data: addBanner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editBanner = async (req, res) => {
  if (!req.params.id) {
    return res.json({
      success: false,
      message: "No ID provided for the banner.",
    });
  }
  try {
    let filePath = null;
    if (req.file) {
      filePath = `/src/uploads/event_image/${req.file.filename}`;
    } else {
      const existingBanner = await LiveEvent.findOne({
        where: {
          id: req.params.id,
        },
        attributes: ["event_img"],
      });
      if (existingBanner && existingBanner.event_img) {
        filePath = existingBanner.event_img;
      } else {
        return res.json({
          success: false,
          message: "No image provided for editing and no existing image found.",
        });
      }
    }
    const { event_name, event_url, event_date, video_url, status } = req.body;
    console.log(event_url);
    const banner = await LiveEvent.update(
      {
        event_name,
        event_url,
        event_date,
        video_url,
        event_img: filePath,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    return res.json({
      success: true,
      message: "Banner updated successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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
  try {
    const banner = await LiveEvent.findAll({});
    if (!banner) {
      return res.status(404).json({
        message: "Banner not found",
        status: false,
      });
    }
    return res.status(200).json({
      message: "Banner get successfully",
      status: true,
      data: banner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getBannerImages,
  getAllBanner,
  editBanner,
  addBanner,
  deleteBanner,
};
