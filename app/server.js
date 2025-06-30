require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require('express-fileupload');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Hàm kết nối MongoDB với xử lý lỗi chi tiết
const connectToMongoDB = async () => {
  try {
    // Log chuỗi kết nối (đã ẩn mật khẩu)
    const maskedURI = process.env.MONGODB_URI.replace(/:[^@]+@/, ':*****@');
    console.log(`🔗 Connecting to MongoDB: ${maskedURI}`);
    
    // Mã hóa các ký tự đặc biệt trong URI
    const encodedURI = encodeURI(process.env.MONGODB_URI);
    console.log(`🔗 Encoded URI: ${encodedURI.replace(/:[^@]+@/, ':*****@')}`);
    
    await mongoose.connect(encodedURI, {
      serverSelectionTimeoutMS: 5000, // 5 giây timeout
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Đã kết nối MongoDB thành công');
  } catch (err) {
    console.error('❌ Lỗi kết nối MongoDB:', err);
    console.error('❌ Nguyên nhân:', err.reason ? err.reason : 'Unknown error');
    
    // Log chi tiết URI
    console.error('❌ Raw connection string:', process.env.MONGODB_URI);
    
    // Thoát ứng dụng nếu không kết nối được
    process.exit(1);
  }
};

// Gọi hàm kết nối
connectToMongoDB();

// Middleware
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Endpoint healthcheck
app.get('/health', (req, res) => {
  // Kiểm tra trạng thái MongoDB
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).send('MongoDB not connected');
  }
  res.status(200).send('OK');
});

// Routes
app.use('/products', productRoutes);

app.get('/', (req, res) => res.redirect('/products'));

// Xử lý lỗi toàn cục
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Khởi động server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên port ${PORT}`);
});

// Xử lý tín hiệu shutdown
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close();
    process.exit(0);
  });
});
