const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route đăng ký
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Route đăng nhập
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

module.exports = router;