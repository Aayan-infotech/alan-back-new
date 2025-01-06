
const mongoose = require('mongoose');

const dimsLockSchema = new mongoose.Schema({
    Product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    },
    Lock: {
        type: String,
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed, 
    }

});

module.exports = mongoose.model('dimsLock', dimsLockSchema);