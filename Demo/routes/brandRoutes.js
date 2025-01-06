const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

// Hiển thị form thêm thương hiệu
router.get('/brand', brandController.getAddBrandPage);

// Thêm thương hiệu mới
router.post('/api/brand', brandController.addBrand);

// Hiển thị danh sách thương hiệu
router.get('/selectbrand', brandController.getBrandList);

// Hiển thị form sửa thương hiệu
router.get('/updatebrand/:id', brandController.getUpdateBrandPage);

// Sửa thương hiệu
router.post('/updatebrand/:id', brandController.updateBrand);

// Xóa thương hiệu
router.get('/deletebrand/:id', brandController.deleteBrand);

module.exports = router;
