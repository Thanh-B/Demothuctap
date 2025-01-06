const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order_id: { type: String, required: true },
    customerid: { type: String, required: true },
    order_date: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['Chờ xử lý', 'Đang xử lý', 'Hoàn thành', 'Đã hủy'],
        default: 'Chờ xử lý'
    },
    total_amount: { type: Number, required: true, min: 0 },
    description: { type: String, required: true }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
