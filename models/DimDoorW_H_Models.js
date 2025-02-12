const mongoose = require('mongoose');

const DimDoorWidthHeightSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'Product', // Assuming there is a 'Product' model
        required: false,
        default: null,
    },
    widthHeight: {
        type: String, // Storing widthHeight as a single string
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
        min: 0, // Ensuring price is non-negative
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

module.exports = mongoose.model('DimDoorWidthHeight', DimDoorWidthHeightSchema);
