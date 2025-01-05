// const Product = require('../models/productModel');
// const Customer = require('../models/customerModel');
// const Order = require('../models/orderModel');

exports.getAdminPage = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {
        // const totalProducts = await Product.countDocuments();
        // const totalCustomers = await Customer.countDocuments();
        // const totalOrders = await Order.countDocuments();

        res.render('admin', {
            username: req.session.username,
           // totalProducts: totalProducts,
            //totalCustomers: totalCustomers,
           // totalOrders: totalOrders
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Có lỗi xảy ra khi lấy dữ liệu');
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Có lỗi khi đăng xuất');
        }
        res.redirect('/login');
    });
};