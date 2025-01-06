const Order = require('../models/order');

// Hiển thị danh sách đơn hàng
exports.getOrders = async (req, res) => {
    const username = req.session.username;

    if (!username) {
        return res.redirect('/login');
    }

    try {
        const orders = await Order.find().exec();
        res.render('orders/selectorder', { username, orders });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi hiển thị danh sách đơn hàng.');
    }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
    const orderId = req.params.order_id;
    const { status } = req.body;

    if (!status || !['Chờ xử lý', 'Đang xử lý', 'Hoàn thành', 'Đã hủy'].includes(status)) {
        return res.status(400).send('Trạng thái không hợp lệ.');
    }

    try {
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).send('Đơn hàng không tồn tại.');
        }

        res.redirect('/selectorder');
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.');
    }
};

// Hiển thị trang xác nhận xóa đơn hàng
exports.getDeleteOrderPage = async (req, res) => {
    const orderId = req.params.order_id;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send('Đơn hàng không tồn tại!');
        }

        res.render('orders/deleteorder', { order });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi lấy thông tin đơn hàng.');
    }
};

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
    const orderId = req.params.order_id;

    try {
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).send('Đơn hàng không tồn tại!');
        }

        res.redirect('/selectorder');
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi xóa đơn hàng.');
    }
};
