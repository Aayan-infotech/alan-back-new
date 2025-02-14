const mongoose = require('mongoose');
const models = {
    DimDoorFrameWidthHeight: require('../models/DimDoor/DimDoorW_H_Models'),
    DimDoorPreHungOptions: require('../models/DimDoor/DimDoorPreHungModel'),
    DimDoorPreFinishingOptions: require('../models/DimDoor/DimDoorPreFinishingModel'),
    DimDoorSwingDirection: require('../models/DimDoor/DimDoorSwingDirectionModel'),
    DimDoorFrameOptions: require('../models/DimDoor/DimDoorFrameOptioModel'),
    DimDoorPeepView: require('../models/DimDoor/DimDoorPeepViewModel'),
    DimDoorHingeColor: require('../models/DimDoor/DimDoorHingeColorModel'),
    DimDoorSill: require('../models/DimDoor/DimDoorSillModels'),
    DimDoorWeatherStripColor: require('../models/DimDoor/DimDoorWeatherStripColorModule'),
    DimDoorGridOptions: require('../models/DimDoor/DimDoorGridOptionsModels'),
    DimDoorFrameExtrusion: require('../models/DimDoor/DimDoorFrameExtrusionModel'),
    DimDoorLockOption: require('../models/DimDoor/DimDoorLockOptionModel'),
    DimDoorColor: require('../models/DimDoor/DimDoorColorModel'),
    DimDoorWidthFrame: require('../models/DimDoor/DimDoorWidthFrameModel'),
    DimDoorJambSize: require('../models/DimDoor/DimDoorJambSizeModel'),
    DimDoorShoe: require('../models/DimDoor/DimDoorShoeModel'),
    DimDoorWeatherstrip: require('../models/DimDoor/DimDoorWeatherstripModel'),
    DimDoorHinges: require('../models/DimDoor/DimDoorHingesModel'),
    DimDoorBoreOptions: require('../models/DimDoor/DimDoorBoreOptionsModel'),
    DimDoorInstallationAvailability: require('../models/DimDoor/DimDoorInstallationAvailabilityModel'),
    // DimDoorSpecialInstructions: require('../models/DimDoorSpecialInstructions'),
    DimDoorSideWindowOpens: require('../models/DimDoor/DimDoorSideWindowOpensModel')
};

// Generic function to create an entry
exports.createEntry = async (req, res) => {
    try {
        const { modelName } = req.params;
        if (!models[modelName]) return res.status(400).json({ error: 'Invalid model name' });
        const entry = new models[modelName](req.body);
        await entry.save();
        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve entries by productId
exports.getEntriesByProductId = async (req, res) => {
    try {
        const { modelName, productId } = req.params;
        if (!models[modelName]) return res.status(400).json({ error: 'Invalid model name' });
        const entries = await models[modelName].find({ productId });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an entry by ID
exports.deleteEntry = async (req, res) => {
    try {
        const { modelName, id } = req.params;
        if (!models[modelName]) return res.status(400).json({ error: 'Invalid model name' });
        await models[modelName].findByIdAndDelete(id);
        res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};