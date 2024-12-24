const mongoose = require("mongoose");

// Generate SKU
const generateSKU = () => {
    return 'SKU-' + Math.random().toString(36).substring(2, 10).toUpperCase();
};

const Product = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0,
        required: false,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    },
    sub_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    },
    sub_sub_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    },
    name: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        default: generateSKU,  // Automatically generate SKU if not provided
    },
    ins_date: {
        type: Date,
        required: false,
        default: Date.now,  // Default to current date if not provided
    },
    ins_ip: {
        type: String,
        required: false,
    },
    ins_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    },
});

module.exports = mongoose.model('Product', Product);
