const mongoose = require('mongoose');

const whiteHeight Schema = new mongoose.Schema({
    Product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false, 
        default: null
    },
    whiteHeight : {
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

module.exports = mongoose.model('DimswhiteHeight ', whiteHeight Schema);
