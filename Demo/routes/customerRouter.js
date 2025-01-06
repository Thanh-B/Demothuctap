const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// GET - Form thêm khách hàng
router.get('/customer', customerController.getCreateCustomerForm);

// POST - Tạo khách hàng mới
router.post('/api/customer', customerController.createCustomer);

// GET - Danh sách khách hàng
router.get('/selectcustomer', customerController.getCustomerList);

// GET - Xóa khách hàng
router.get('/deletecustomer/:id', customerController.deleteCustomer);

// GET - Hiển thị form sửa khách hàng
router.get('/updatecustomer/:id', customerController.getUpdateCustomerForm);

// POST - Cập nhật khách hàng
router.post('/updatecustomer/:id', customerController.updateCustomer);

module.exports = router;
