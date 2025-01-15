const mongoose = require('mongoose');

const widthHeightSchema = new mongoose.Schema({
    Product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false, 
        default: null
    },
    widthHeight: {
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

module.exports = mongoose.model('DimswidthHeight', widthHeightSchema);
