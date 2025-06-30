require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối MongoDB
console.log('Attempting to connect to MongoDB with URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1); // Thoát nếu kết nối thất bại
});

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
