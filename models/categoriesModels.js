const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    images: {
        type: Array,
        required: false,
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
        default: Date.now,
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
        //   ref: 'User',
        required: false,
        default: null,
    },
    update_ip: {
        type: String,
        default: null,
    },
});

module.exports = mongoose.model('Category', categorySchema);
