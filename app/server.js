require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require('express-fileupload');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Đã kết nối MongoDB thành công'))
.catch(err => {
  console.error('❌ Lỗi kết nối MongoDB:', err);
  console.error('❌ Connection string:', process.env.MONGODB_URI);
});

// Middleware
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Routes
// Thêm route healthcheck trước các route khác
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use('/products', productRoutes);

app.get('/', (req, res) => res.redirect('/products'));

// Khởi động server và xử lý shutdown
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Xử lý tín hiệu shutdown để giải phóng port
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
