const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Categories",
        required: false,
        default: null
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        default: 0,
        required: true,
    },
    ins_date: {
        type: Date,
        required: true,
    },
    ins_ip: {
        type: String,
        required: true,
    },
    ins_by: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        required: false,
        default: null
    },
    update_date: {
        type: Date,
        default: null,
    },
    update_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    update_ip: {
        type: String,
        default: null,
    },
});

module.exports = mongoose.model('subCategory', subCategorySchema);
