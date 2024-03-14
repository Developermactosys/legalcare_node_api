const express = require('express');
const router = express.Router();
const {uploads} = require('../../../middleware/multer');
const { authorize } = require("../../../middleware/authorization")

const {getAllBanner,addBanner,editBanner,deleteBanner,update_banner_status} = require("../../../controller/admin_controller/banner_controller/banner.controller");

// router.get("/get_banner_images",authorize(['0']),getBannerImages);
// router.post("/add_banner", authorize(['0']), uploads.single("event_img"),addBanner);
// router.patch("/edit_banner/:id", editBanner);
// router.delete("/delete_banner/:id", authorize(['0']),deleteBanner);
// router.get("/getall_banner",authorize(['0']), getAllBanner);

router.post("/add_banner",authorize(['0']), uploads.single("banner_image"), addBanner); // done
router.patch("/edit_banner/:id", authorize(['0']),uploads.single("banner_image"), editBanner); // done
router.delete("/delete_banner/:id",authorize(['0']), deleteBanner); // done
router.post("/get_banner_images",authorize(['0']), getAllBanner); //  done

// For FrontEnd Team (admin_section)
router.get("/get_banner_images",authorize(['0']), getAllBanner); //  done
router.patch("/update_event_status",authorize(['0']),uploads.none(), update_banner_status);
module.exports = router;