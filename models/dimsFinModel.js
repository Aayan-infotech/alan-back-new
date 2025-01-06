const mongoose = require('mongoose');

const dimsFinSchema = new mongoose.Schema({
    Product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    },
    Fin: {
        type: String,
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed, // This will allow both numbers and percentage strings
        required: true,
    }

});

module.exports = mongoose.model('dimsFin', dimsFinSchema);
