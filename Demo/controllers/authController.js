const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// Trang đăng ký (GET)
exports.getRegister = (req, res) => {
    res.render('register');
};

// Route đăng ký (POST)
exports.postRegister = async (req, res) => {
    const { username, email, password, rePassword } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password || !rePassword) {
        return res.status(400).send('Vui lòng nhập đầy đủ thông tin!');
    }

    if (password !== rePassword) {
        return res.status(400).send('Mật khẩu và xác nhận mật khẩu không khớp!');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send('Email không hợp lệ!');
    }

    try {
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email đã tồn tại!');
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Lưu người dùng mới vào cơ sở dữ liệu
        const newUser = await User.create({ username, email, password: hashedPassword });

        res.redirect('/login?message=Đăng ký thành công! Bạn có thể đăng nhập ngay.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi đăng ký');
    }
};

// Trang đăng nhập (GET)
exports.getLogin = (req, res) => {
    const message = req.query.message || '';
    res.render('login', { message });
};

// Route đăng nhập (POST)
exports.postLogin = async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).send('Vui lòng nhập đầy đủ thông tin!');
    }

    try {
        let user;
        // Kiểm tra login có phải email hay không
        if (login.includes('@')) {
            user = await User.findOne({ email: login });
        } else {
            user = await User.findOne({ username: login });
        }

        // Kiểm tra người dùng có tồn tại không và mật khẩu có khớp không
        if (!user) {
            return res.status(400).send('Tên người dùng hoặc mật khẩu không đúng!');
        }

        // So sánh mật khẩu đã mã hóa
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Tên người dùng hoặc mật khẩu không đúng!');
        }

        // Lưu thông tin người dùng vào session
        req.session.userId = user._id;
        req.session.username = user.username;

        // Redirect đến trang quản trị hoặc trang chủ sau khi đăng nhập thành công
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi đăng nhập');
    }
};