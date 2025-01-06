const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    namebrand: { type: String, required: true },
    namecategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, required: true }
});

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;
