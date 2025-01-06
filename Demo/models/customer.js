const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerid: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
