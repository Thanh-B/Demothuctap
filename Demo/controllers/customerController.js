const Customer = require('../models/customer'); // Giả sử bạn sử dụng Mongoose

// GET - Trang tạo khách hàng
const getCreateCustomerForm = async (req, res) => {
    const username = req.session.username;
    if (!username) {
        return res.redirect('/login');
    }
    try {
        res.render('customers/customer', { username });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi hiển thị form thêm khách hàng.');
    }
};

// POST - Tạo khách hàng mới
const createCustomer = async (req, res) => {
    const { customerid, name, gender, address, phone, email } = req.body;

    if (!customerid || !name || !gender || !address || !phone || !email) {
        return res.status(400).send('Vui lòng điền đầy đủ thông tin!');
    }

    try {
        const newCustomer = new Customer({
            customerid, name, gender, address, phone, email
        });

        await newCustomer.save();
        res.redirect('/selectcustomer');
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).send('Email đã tồn tại, vui lòng sử dụng email khác!');
        }
        res.status(500).send('Có lỗi xảy ra khi thêm khách hàng.');
    }
};

// GET - Danh sách khách hàng
const getCustomerList = async (req, res) => {
    const username = req.session.username;
    if (!username) {
        return res.redirect('/login');
    }

    try {
        const customers = await Customer.find();
        res.render('customers/selectcustomer', { username, customers });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi hiển thị danh sách khách hàng.');
    }
};

// GET - Xóa khách hàng
const deleteCustomer = async (req, res) => {
    const customerId = req.params.id;

    try {
        const customer = await Customer.findByIdAndDelete(customerId);
        if (!customer) {
            return res.status(404).send('Khách hàng không tồn tại!');
        }
        res.redirect('/selectcustomer');
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi xóa khách hàng.');
    }
};

// GET - Hiển thị form sửa khách hàng
const getUpdateCustomerForm = async (req, res) => {
    const customerId = req.params.id;
    const username = req.session.username;

    if (!username) {
        return res.redirect('/login');
    }

    try {
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).send('Không tìm thấy khách hàng');
        }
        res.render('customers/updatecustomer', { customer, username });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi lấy khách hàng để sửa.');
    }
};

// POST - Cập nhật thông tin khách hàng
const updateCustomer = async (req, res) => {
    const customerId = req.params.id;
    const { name, gender, address, phone, email } = req.body;
    const username = req.session.username;

    if (!username) {
        return res.redirect('/login');
    }

    try {
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).send('Không tìm thấy khách hàng');
        }

        customer.name = name;
        customer.gender = gender;
        customer.address = address;
        customer.phone = phone;
        customer.email = email;

        await customer.save();
        res.redirect('/selectcustomer');
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi cập nhật khách hàng.');
    }
};

module.exports = {
    getCreateCustomerForm,
    createCustomer,
    getCustomerList,
    deleteCustomer,
    getUpdateCustomerForm,
    updateCustomer,
};
