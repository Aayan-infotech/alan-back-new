const mongoose = require('mongoose');

const dimsPanelSpacingSchema = new mongoose.Schema({
    Product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    },
    PanelSpacing: {
        type: String,
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed, 
        required: true,
    }

});

module.exports = mongoose.model('pSpacing', dimsPanelSpacingSchema);