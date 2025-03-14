const mongoose = require('mongoose');

const DimDoorWidthHeightSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null,
    },
    DoorWidthHeight: {
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
        required: true,
        min: 0, 
    }
}, { timestamps: true }); 

module.exports = mongoose.model('DoorWidthHeight', DimDoorWidthHeightSchema);
