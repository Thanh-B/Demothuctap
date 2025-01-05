// models/category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
   namecategory: { type: String, required: true },
   description: { type: String, required: true }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
