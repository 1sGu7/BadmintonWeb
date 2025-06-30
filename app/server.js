require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  auth: {
    username: 'shop_user', // Thay bằng username thực tế
    password: 'shop_password' // Thay bằng password thực tế
  },
  authSource: 'admin' // Thường là 'admin' cho MongoDB Atlas
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/products', productRoutes);
app.use('/upload', uploadRoutes);

app.get('/', (req, res) => res.redirect('/products'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
