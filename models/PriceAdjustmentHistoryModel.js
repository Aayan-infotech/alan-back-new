const mongoose = require('mongoose');

const PriceAdjustment = new mongoose.Schema({
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
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatePercent: {
        type: Number, 
        required: true
    },
    PriceAdjustment: {
        type: String,
        enum: ['increase', 'decrease'],
        required: true
    }
});

module.exports = mongoose.model('PriceAdjustmentHistory', PriceAdjustment);
