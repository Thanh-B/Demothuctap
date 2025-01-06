const express = require('express');
const path = require('path');
const session = require('express-session');
const connect = require('./connect');  // Import connect function
const adminController = require('./controllers/adminController');
const authController = require('./controllers/authController'); 

const app = express();

// Kết nối MongoDB
connect();  // Gọi hàm connect từ connect.js để kết nối MongoDB

// Cấu hình để phục vụ các tài nguyên tĩnh (CSS, font, js, images)
app.use(express.static(path.join(__dirname, 'assets')));

// Cấu hình session và các middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true
}));

// Route cho trang chính (redirect đến /admin)
app.get('/', (req, res) => {
    res.redirect('/admin');
});

// Route cho trang đăng nhập
app.get('/login', (req, res) => {
    const message = req.query.message || '';
    res.render('login', { message });
});

// Route đăng nhập (POST)
app.post('/login', authController.postLogin);

// Route cho trang đăng ký
app.get('/register', (req, res) => {
    res.render('register');
});

// Route đăng ký (POST)
app.post('/register', authController.postRegister);

// Route cho trang admin (chỉ cho phép truy cập khi đã đăng nhập)
app.get('/admin', adminController.getAdminPage);

// Route đăng xuất
app.get('/logout', adminController.logout);

// Lắng nghe server
app.listen(3000, () => {
    console.log('Server đang chạy tại http://localhost:3000');
});