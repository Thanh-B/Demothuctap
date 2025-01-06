const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route: Hiển thị danh sách đơn hàng
router.get('/selectorder', orderController.getOrders);

// Route: Cập nhật trạng thái đơn hàng
router.post('/updateOrderStatus/:order_id', orderController.updateOrderStatus);

// Route: Hiển thị trang xác nhận xóa đơn hàng
router.get('/deleteorder/:order_id', orderController.getDeleteOrderPage);

// Route: Xóa đơn hàng
router.post('/deleteorder/:order_id', orderController.deleteOrder);

module.exports = router;
