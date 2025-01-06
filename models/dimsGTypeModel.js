const mongoose = require('mongoose');

const dimsGlassTypeSchema = new mongoose.Schema({
    Product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    },
    GlassType: {
        type: String,
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed, 
        required: true,
    }

});

module.exports = mongoose.model('dimsGType', dimsGlassTypeSchema);