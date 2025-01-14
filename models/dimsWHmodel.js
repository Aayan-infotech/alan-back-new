const mongoose = require('mongoose');

const whiteHeightSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false, 
        default: null
    },
    whiteHeight: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
        default: null 
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    }
});

module.exports = mongoose.model('DimsWhiteHeight', whiteHeightSchema);
