const mongoose = require('mongoose');

const GuestCardMoodSchema = new mongoose.Schema({
    session_id: {
        type: String, 
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    product_price: {
        type: Number,
        required: true,
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: false,
    },
    selectedOptions: {
        type: Map,
        of: String, 
        required: false,
    },
    customDimensions: {
        height: { type: String, required: false },
        width: { type: String, required: false },
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('GuestCardMood', GuestCardMoodSchema);
