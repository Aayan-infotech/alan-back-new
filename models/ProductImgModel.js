const mongoose = require("mongoose");

const ProductImageSchema = new mongoose.Schema({
    images: {
        type: Array,
        required: false, // Change to true if images are mandatory
    },
    Product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false, // You can make this required if needed
        default: null
    },
});

module.exports = mongoose.model('ProductImage', ProductImageSchema);
