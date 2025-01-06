const mongoose = require('mongoose');

const dimsModels = {
    Grid: require('../models/dimsGridModel'),
    Fin: require('../models/dimsFinModel'),
    Color: require('../models/dimsColorModel'),
    Tampering: require('../models/dimsTamperModel'),
    installation: require('../models/dimsInstModel'),
    Lock: require('../models/dimsLockModel'),
    GlassType: require('../models/dimsGTypeModel'),
    PanelSpacing: require('../models/dimsPSpacingModel'),
    SideWindowOpens: require('../models/dimsSWinOpensModel'),
};

// GET request: fetch data by type and Product_id
exports.getDimensionsByTypeAndProductId = async (req, res) => {
    const { type, Product_id } = req.params;

    try {
        // Validate type
        if (!dimsModels[type]) {
            return res.status(400).json({ error: `Invalid type: ${type}` });
        }

        // Fetch data from the corresponding model
        const data = await dimsModels[type].find({ Product_id });

        // Check if data exists
        if (!data || data.length === 0) {
            return res.status(404).json({ message: `No data found for type: ${type} and Product_id: ${Product_id}` });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching dimensions:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
