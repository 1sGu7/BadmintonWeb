const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');

// Tạo thư mục nếu chưa tồn tại
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/images');
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