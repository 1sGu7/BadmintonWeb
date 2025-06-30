const Product = require('../models/Product');

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
    const image = req.file ? `/images/${req.file.filename}` : '';
    
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image
    });

    await newProduct.save();
    res.redirect('/products');
  } catch (err) {
    res.status(400).send(err.message);
  }
};