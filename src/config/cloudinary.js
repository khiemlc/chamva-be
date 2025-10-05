const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage duy nhất (ảnh + docs + excel)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = file.originalname.split(".").pop(); // lấy đuôi file
    const baseName = file.originalname.replace(/\.[^/.]+$/, ""); // bỏ đuôi

    let resourceType = "raw"; // mặc định docs/excel/pdf
    if (file.mimetype.startsWith("image/")) {
      resourceType = "image";
    }

    return {
      folder: "attachments",
      resource_type: resourceType, // image | raw
      public_id: baseName, // giữ tên file gốc (không random nữa)
      format: ext, // giữ đúng đuôi
    };
  },
});

// Middleware upload
const uploadMixed = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedImage = ["image/jpeg", "image/png", "image/gif"];
    const allowedDocs = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (allowedImage.includes(file.mimetype) || allowedDocs.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed"), false);
    }
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // max 20MB
});

module.exports = { uploadMixed };
