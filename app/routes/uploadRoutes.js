const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Tạo thư mục nếu chưa tồn tại
const ensureUploadDir = () => {
  const uploadPath = path.join(__dirname, '../public/images');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = ensureUploadDir();
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  res.json({ filename: req.file.filename });
});

module.exports = router;
