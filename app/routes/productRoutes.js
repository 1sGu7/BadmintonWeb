const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/new', productController.getProductForm);
router.post('/', productController.createProduct);

module.exports = router;