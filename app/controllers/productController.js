const Product = require('../models/Product');
const path = require('path');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { products });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getProductForm = (req, res) => {
  res.render('add-product');
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    
    // Xử lý upload ảnh
    if (!req.files || !req.files.image) {
      return res.status(400).send('Vui lòng chọn hình ảnh sản phẩm');
    }

    const imageFile = req.files.image;
    const imageName = `${Date.now()}-${imageFile.name}`;
    const uploadPath = path.join(__dirname, '../../public/images', imageName);
    
    // Lưu file vào thư mục public/images
    await imageFile.mv(uploadPath);
    
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image: `/images/${imageName}`
    });

    await newProduct.save();
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
};
