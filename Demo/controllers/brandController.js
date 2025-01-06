const Brand = require('../models/brand');
const Category = require('../models/category');

// Hiển thị form thêm thương hiệu
exports.getAddBrandPage = async (req, res) => {
    const username = req.session.username;

    if (!username) {
        return res.redirect('/login');
    }

    try {
        const categories = await Category.find({});
        res.render('brands/brand', { username, categories });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi lấy danh mục.');
    }
};

// Thêm thương hiệu mới
exports.addBrand = async (req, res) => {
    const { namebrand, description, namecategory } = req.body;

    if (!namebrand || !description || !namecategory) {
        return res.status(400).send('Vui lòng điền đầy đủ thông tin!');
    }

    try {
        const category = await Category.findById(namecategory);
        if (!category) {
            return res.status(400).send('Danh mục không hợp lệ!');
        }

        const newBrand = new Brand({ namebrand, description, namecategory });
        await newBrand.save();
        res.redirect('/selectbrand');
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi thêm thương hiệu.');
    }
};

// Hiển thị danh sách thương hiệu
exports.getBrandList = async (req, res) => {
    const username = req.session.username;

    if (!username) {
        return res.redirect('/login');
    }

    try {
        const brands = await Brand.find().populate('namecategory');
        res.render('brands/selectbrand', { brands, username });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi lấy thương hiệu.');
    }
};

// Hiển thị form cập nhật thương hiệu
exports.getUpdateBrandPage = async (req, res) => {
    const brandId = req.params.id;
    const username = req.session.username;

    if (!username) {
        return res.redirect('/login');
    }

    try {
        const brand = await Brand.findById(brandId).populate('namecategory');
        if (!brand) {
            return res.status(404).send('Không tìm thấy thương hiệu');
        }

        const categories = await Category.find();
        res.render('brands/updatebrand', { brand, categories, username });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi lấy thương hiệu để sửa.');
    }
};

// Cập nhật thương hiệu
exports.updateBrand = async (req, res) => {
    const brandId = req.params.id;
    const { namebrand, description, namecategory } = req.body;

    try {
        const brand = await Brand.findById(brandId);
        if (!brand) {
            return res.status(404).send('Không tìm thấy thương hiệu');
        }

        // Cập nhật thông tin thương hiệu
        brand.namebrand = namebrand;
        brand.description = description;
        brand.namecategory = namecategory;

        await brand.save();
        res.redirect('/selectbrand');
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi cập nhật thương hiệu.');
    }
};

// Xóa thương hiệu
exports.deleteBrand = async (req, res) => {
    const brandId = req.params.id;

    try {
        const result = await Brand.findByIdAndDelete(brandId);
        if (result) {
            res.redirect('/selectbrand');
        } else {
            res.status(404).send('Thương hiệu không tồn tại!');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi xóa thương hiệu.');
    }
};
