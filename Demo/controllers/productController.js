const multer = require('multer');
const path = require('path');
const Product = require('../models/product');
const Brand = require('../models/brand');
const Category = require('../models/category');

// Cấu hình lưu trữ file hình ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Thư mục lưu trữ ảnh
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Tên ảnh duy nhất
    }
});

const upload = multer({ storage: storage });

// Hiển thị trang quản lý sản phẩm
exports.getProductPage = async (req, res) => {
    const username = req.session.username;
    if (!username) {
        return res.redirect('/login');  // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    }

    try {
        // Lấy danh sách các thương hiệu và danh mục từ cơ sở dữ liệu
        const brands = await Brand.find();
        const categories = await Category.find();

        // Truyền dữ liệu vào view
        res.render('products/product', { username, brands, categories });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi lấy danh sách thương hiệu hoặc danh mục.');
    }
};

// Hiển thị danh sách sản phẩm
exports.getSelectProductPage = async (req, res) => {
    const username = req.session.username;
    if (!username) {
        return res.redirect('/login');
    }

    try {
        const products = await Product.find()
            .populate('namebrand')
            .populate('namecategory'); // Lấy thông tin chi tiết của brand và category

        if (!products || products.length === 0) {
            return res.status(404).send('Không có sản phẩm nào.');
        }

        res.render('products/selectproduct', { products, username });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi lấy danh sách sản phẩm.');
    }
};

// Thêm sản phẩm mới
exports.addProduct = async (req, res) => {
    try {
        // Xử lý ảnh tải lên
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).send('Có lỗi khi tải ảnh lên.');
            }

            const { idproduct, nameproduct, namebrand, namecategory, price, quantity, description } = req.body;
            const image = req.file ? req.file.filename : null;  // Lấy tên ảnh từ multer

            // Kiểm tra các trường nhập liệu
            if (!idproduct || !nameproduct || !namebrand || !namecategory || !price || !quantity || !description) {
                return res.status(400).send('Vui lòng nhập đầy đủ thông tin sản phẩm.');
            }

            // Kiểm tra định dạng hình ảnh (nếu có)
            if (image && !image.match(/\.(jpg|jpeg|png)$/)) {
                return res.status(400).send('Định dạng hình ảnh không hợp lệ. Chỉ chấp nhận JPG, JPEG và PNG.');
            }

            // Kiểm tra giá trị price và quantity là số hợp lệ
            if (isNaN(price) || isNaN(quantity)) {
                return res.status(400).send('Giá và số lượng phải là số hợp lệ.');
            }

            // Kiểm tra nếu ID sản phẩm đã tồn tại
            const existingProduct = await Product.findOne({ idproduct });
            if (existingProduct) {
                return res.status(400).send('Sản phẩm với ID này đã tồn tại.');
            }

            // Tạo sản phẩm mới
            const newProduct = new Product({
                idproduct,
                nameproduct,
                namebrand,
                namecategory,
                price,
                quantity,
                description,
                image,  // Lưu tên ảnh
            });

            await newProduct.save();
            res.redirect('/selectproduct'); // Chuyển hướng đến trang danh sách sản phẩm
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi thêm sản phẩm.');
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).send('Không tìm thấy sản phẩm.');
        }
        res.redirect('/selectproduct');
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi xóa sản phẩm.');
    }
};

// Hiển thị form cập nhật sản phẩm
exports.updateProductPage = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);
        const brands = await Brand.find(); // Lấy danh sách thương hiệu
        const categories = await Category.find(); // Lấy danh sách danh mục

        if (!product) {
            return res.status(404).send('Không tìm thấy sản phẩm.');
        }

        const username = req.session.username || 'Khách'; // Lấy thông tin người dùng từ session
        res.render('products/updateproduct', { product, brands, categories, username });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi hiển thị form cập nhật sản phẩm.');
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    const productId = req.params.id;
    const { idproduct, nameproduct, namebrand, namecategory, price, quantity, description } = req.body;

    try {
        // Xử lý ảnh tải lên
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).send('Có lỗi khi tải ảnh lên.');
            }

            // Nếu có ảnh, lấy tên ảnh từ multer, nếu không có thì giữ nguyên ảnh cũ
            const image = req.file ? req.file.filename : null;

            // Tìm sản phẩm trong cơ sở dữ liệu
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).send('Không tìm thấy sản phẩm.');
            }

            // Cập nhật thông tin sản phẩm nếu có
            product.idproduct = idproduct || product.idproduct;
            product.nameproduct = nameproduct || product.nameproduct;
            product.namebrand = namebrand || product.namebrand;
            product.namecategory = namecategory || product.namecategory;
            product.price = price || product.price;
            product.quantity = quantity || product.quantity;
            product.description = description || product.description;

            // Nếu có ảnh mới, cập nhật ảnh
            if (image) {
                product.image = image;
            }

            // Lưu sản phẩm đã được cập nhật vào cơ sở dữ liệu
            await product.save();

            // Chuyển hướng đến trang danh sách sản phẩm
            res.redirect('/selectproduct'); 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi cập nhật sản phẩm.');
    }
};
