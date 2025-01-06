// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Route danh mục sản phẩm (category)
router.get('/category', categoryController.getCategoryPage);

// API thêm Category
router.post('/api/category', categoryController.addCategory);

// Hiển thị danh sách Category
router.get('/selectcategory', categoryController.getSelectCategoryPage);

// Xóa Category
router.get('/deletecategory/:id', categoryController.deleteCategory);

// Cập nhật Category
router.get('/updatecategory/:id', categoryController.updateCategoryPage);
router.post('/updatecategory/:id', categoryController.updateCategory);

module.exports = router;
