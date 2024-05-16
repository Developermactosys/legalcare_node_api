const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = ""; // Define the upload path

    if (file.fieldname === "profile_image") {
      uploadPath = path.join(__dirname, "../../public/uploads/profile_image");
    }
     else if (file.fieldname === "document_for_academy") {
      uploadPath = path.join(__dirname, "../../public/uploads/document_of_academy");
    } else if (file.fieldname === "document_for_tutor") {
      uploadPath = path.join(__dirname,  "../../public/uploads/document_of_tutor");
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