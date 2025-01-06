const mongoose = require('mongoose');

const dimsGridSchema = new mongoose.Schema({
    Product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    },
    Grid: {
        type: String,
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed, 
        required: true,
    }

});

module.exports = mongoose.model('dimsGrid', dimsGridSchema);
