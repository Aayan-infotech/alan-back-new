const mongoose = require('mongoose');

const dimsColorSchema = new mongoose.Schema({
    Product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    },
    Color: {
        type: String,
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed, 
        required: false,
        default: null,
    },
    amount: {
        type: Number,
        required: false,
        default: null
    }

});

module.exports = mongoose.model('dimsColor', dimsColorSchema);
