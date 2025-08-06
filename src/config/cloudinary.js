const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  allowedFormats: ["jpg", "png", "jpeg", "gif"],
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  // lưu vào folder avatar trên cloudinary
  params: {
    folder: "avatar",
  },
});

// Cấu hình mới cho lưu trữ tài liệu
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  allowedFormats: ["pdf", "doc", "docx"],
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop(); // Lấy phần mở rộng file

    cb(null, (file.originalname + "." + ext));
  },
  // Lưu vào folder documents trên cloudinary
  params: {
    folder: "documents",
    resource_type: "raw"
  },
});

// Upload cấu hình cho ảnh (giữ nguyên)
const upload = multer({
  storage: storage,
  // kiểm tra định dạng file
  fileFilter: (req, file, cb) => {
    const allowedFormats = ["image/jpeg", "image/png", "image/gif"];
    // nếu định dạng file được phép upload thì accept
    if (allowedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file format. Only JPG, PNG, and GIF are allowed!"),
        false
      );
    }
  },
});

// Upload cấu hình mới cho tài liệu
const uploadDocument = multer({
  storage: documentStorage,
  fileFilter: (req, file, cb) => {
    const allowedFormats = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (allowedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file format. Only PDF, DOC, and DOCX are allowed!"),
        false
      );
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // Giới hạn kích thước 10MB
  }
});

module.exports = { upload, uploadDocument };