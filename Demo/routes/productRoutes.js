const express = require('express');
const router = express.Router();

// Import controller
const productController = require('../controllers/productController');

// Route cho trang quản lý sản phẩm
router.get('/product', productController.getProductPage);

// Route cho trang danh sách sản phẩm
router.get('/selectproduct', productController.getSelectProductPage);

// Route thêm sản phẩm
router.post('/api/product', productController.addProduct);

// Route xóa sản phẩm
router.get('/deleteproduct/:id', productController.deleteProduct);

// Route cập nhật sản phẩm
router.get('/updateproduct/:id', productController.updateProductPage);
router.post('/updateproduct/:id', productController.updateProduct);

module.exports = router;
