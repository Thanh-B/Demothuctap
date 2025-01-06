// controllers/categoryController.js

const Category = require('../models/category'); // Import model Category nếu bạn dùng MongoDB hoặc cơ sở dữ liệu khác

// Hàm hiển thị trang danh mục sản phẩm
exports.getCategoryPage = (req, res) => {
    const username = req.session.username;
    if (!username) {
        return res.redirect('/login');  // Kiểm tra nếu chưa đăng nhập thì chuyển đến login
    }
    res.render('categories/category', { username });
};

// Hàm hiển thị danh sách Category
exports.getSelectCategoryPage = async (req, res) => {
    const username = req.session.username;
    if (!username) {
        return res.redirect('/login');
    }
    
    try {
        const categories = await Category.find();  // Lấy danh sách danh mục từ database
        res.render('categories/selectcategory', { categories, username });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi lấy danh mục.');
    }
};

// Hàm thêm Category mới (API)
exports.addCategory = async (req, res) => {
    try {
        const { namecategory, description } = req.body;

        // Kiểm tra xem tất cả các trường có được điền không
        if (!namecategory || !description) {
            return res.status(400).json({ message: 'Cả hai trường tên danh mục và mô tả đều là bắt buộc' });
        }

        // Tạo mới một Category và lưu vào CSDL
        const newCategory = new Category({ namecategory, description });
        await newCategory.save();

        // Chuyển hướng đến trang selectcategory sau khi thêm thành công
        res.redirect('/selectcategory');  // Chuyển hướng đến trang danh sách danh mục
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi thêm danh mục', error });
    }
};
// Hàm xóa Category
exports.deleteCategory = async (req, res) => {
    const categoryId = req.params.id;

    try {
        await Category.findByIdAndDelete(categoryId);  // Xóa danh mục theo id
        res.redirect('/selectcategory');  // Quay lại trang danh sách danh mục sau khi xóa
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi xóa danh mục.');
    }
};

// Hàm cập nhật Category (hiển thị form cập nhật)
exports.updateCategoryPage = async (req, res) => {
    const categoryId = req.params.id;

    try {
        const category = await Category.findById(categoryId);  // Lấy danh mục cần cập nhật
        if (!category) {
            return res.status(404).send('Không tìm thấy danh mục.');
        }

        // Giả sử bạn có thông tin người dùng trong session
        const username = req.session.username || 'Khách'; // Nếu không có session thì mặc định là 'Khách'

        // Render trang cập nhật danh mục và truyền thông tin category và username vào
        res.render('categories/updatecategory', { category, username });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi lấy danh mục.');
    }
};

// Hàm cập nhật Category (thực hiện cập nhật)
exports.updateCategory = async (req, res) => {
    const categoryId = req.params.id;
    const { namecategory, description } = req.body;

    try {
        // Kiểm tra nếu namecategory và description không hợp lệ
        if (!namecategory || !description) {
            return res.status(400).send('Tên danh mục và mô tả là bắt buộc.');
        }

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { namecategory, description }, { new: true });  // Cập nhật danh mục
        
        // Kiểm tra nếu không tìm thấy danh mục
        if (!updatedCategory) {
            return res.status(404).send('Không tìm thấy danh mục để cập nhật.');
        }

        res.redirect('/selectcategory');  // Quay lại trang danh sách danh mục sau khi cập nhật
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi cập nhật danh mục.');
    }
};
