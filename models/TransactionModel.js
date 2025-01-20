const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    amount: {
        type: Number,
        required: false,
    },
    quantity: {
        type: Number,
        required: false,
    },
    currency: {
        type: String,
        required: false,
    },
    paymentId: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Transaction', transactionSchema);
