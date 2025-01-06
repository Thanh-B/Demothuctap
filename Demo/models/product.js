const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    idproduct: { type: String, required: true },
    nameproduct: { type: String, required: true }, // Tên sản phẩm
    namebrand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true }, // Thương hiệu
    namecategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Danh mục
    price: { type: Number, required: true }, // Giá
    quantity: { type: Number, required: true }, // Số lượng
    description: { type: String, required: true }, // Mô tả
    image: { type: String, required: true }, // Ảnh
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }, // Trạng thái
    createdAt: { type: Date, default: Date.now }, // Ngày tạo
    updatedAt: { type: Date, default: Date.now } // Ngày cập nhật
});

// Middleware để cập nhật `updatedAt`
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
