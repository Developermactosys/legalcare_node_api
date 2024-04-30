const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = ""; // Define the upload path

    if (file.fieldname === "profile_image") {
      uploadPath = path.join(__dirname, "../../src/uploads/profile_image");
    } else if (file.fieldname === "category_image") {
      uploadPath = path.join(__dirname, "../../src/uploads/category_img");
    } else if (file.fieldname === "banner_image") {
      uploadPath = path.join(__dirname,  "../../src/uploads/banner_image");
    } else if (file.fieldname === "subcategory_img") {
      uploadPath = path.join(__dirname, "../../src/uploads/subcategory_img");
    } else if (file.fieldname === "service_img") {
        uploadPath = path.join(__dirname, "../../src/uploads/service_img");
    } else if (file.fieldname === "image") {
      uploadPath = path.join(__dirname, "../../src/uploads/chat_message");
  }else if (file.fieldname === "certificate_of_membership") {
    uploadPath = path.join(__dirname, "../../src/uploads/documents");
  } else if (file.fieldname === "certificate_of_practice") {
    uploadPath = path.join(__dirname, "../../src/uploads/documents");
  } else if (file.fieldname === "pan_card_image") {
    uploadPath = path.join(__dirname, "../../src/uploads/documents");
    
  } else if (file.fieldname === "aadhar_card_image") {
    uploadPath = path.join(__dirname, "../../src/uploads/documents");
  }
  else if (file.fieldname === "passbook_image") {
    uploadPath = path.join(__dirname, "../../src/uploads/documents");
  } else if (file.fieldname === "document") {
    uploadPath = path.join(__dirname, "../../src/uploads/documents");
  }
  else if (file.fieldname === "pan_doc") {
    uploadPath = path.join(__dirname, "../../src/uploads/documents");
  }
  else if (file.fieldname === "aadhar_doc") {
    uploadPath = path.join(__dirname, "../../src/uploads/documents");
  }
  else if (file.fieldname === "passbook_img") {
    uploadPath = path.join(__dirname, "../../src/uploads/documents");
  }
  else if (file.fieldname === "favicon_img") {
    uploadPath = path.join(__dirname, "../../src/uploads/theme_images");
  }else if (file.fieldname === "logo_img") {
    uploadPath = path.join(__dirname, "../../src/uploads/theme_images");
  }else if (file.fieldname === "query_img") {
    uploadPath = path.join(__dirname, "../../src/uploads/query_img");
  }
  else {
      console.log(`multer problem ${file.fieldname}`);
      return cb(new Error("Invalid fieldname"));
    }

    // Use fs module to create the folder
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating folder:", err);
        return cb(err);
      }
      cb(null, uploadPath);
    });
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const uploads = multer({
  storage: fileStorage,
  limits: {
    fileSize: 5000000, // 5000000 Bytes = 5 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|doc|docx|pdf|txt|xls|xlsx|ppt|pptx)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload an Image"));
    }
    cb(null, true);
  },
});

module.exports = { uploads };