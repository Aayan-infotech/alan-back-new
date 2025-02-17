// const mongoose = require('mongoose');
// const models = {
//     DimDoorFrameWidthHeight: require('../models/DimDoor/DimDoorW_H_Models'),
//     DimDoorPreHungOptions: require('../models/DimDoor/DimDoorPreHungModel'),
//     DimDoorPreFinishingOptions: require('../models/DimDoor/DimDoorPreFinishingModel'),
//     DimDoorSwingDirection: require('../models/DimDoor/DimDoorSwingDirectionModel'),
//     DimDoorFrameOptions: require('../models/DimDoor/DimDoorFrameOptioModel'),
//     DimDoorPeepView: require('../models/DimDoor/DimDoorPeepViewModel'),
//     DimDoorHingeColor: require('../models/DimDoor/DimDoorHingeColorModel'),
//     DimDoorSill: require('../models/DimDoor/DimDoorSillModels'),
//     DimDoorWeatherStripColor: require('../models/DimDoor/DimDoorWeatherStripColorModule'),
//     DimDoorGridOptions: require('../models/DimDoor/DimDoorGridOptionsModels'),
//     DimDoorFrameExtrusion: require('../models/DimDoor/DimDoorFrameExtrusionModel'),
//     DimDoorLockOption: require('../models/DimDoor/DimDoorLockOptionModel'),
//     DimDoorColor: require('../models/DimDoor/DimDoorColorModel'),
//     DimDoorWidthFrame: require('../models/DimDoor/DimDoorWidthFrameModel'),
//     DimDoorJambSize: require('../models/DimDoor/DimDoorJambSizeModel'),
//     DimDoorShoe: require('../models/DimDoor/DimDoorShoeModel'),
//     DimDoorWeatherstrip: require('../models/DimDoor/DimDoorWeatherstripModel'),
//     DimDoorHinges: require('../models/DimDoor/DimDoorHingesModel'),
//     DimDoorBoreOptions: require('../models/DimDoor/DimDoorBoreOptionsModel'),
//     DimDoorInstallationAvailability: require('../models/DimDoor/DimDoorInstallationAvailabilityModel'),
//     // DimDoorSpecialInstructions: require('../models/DimDoorSpecialInstructions'),
//     DimDoorSideWindowOpens: require('../models/DimDoor/DimDoorSideWindowOpensModel')
// };

// controllers/DimDoorControllers.js
const mongoose = require('mongoose');
const models = {
    DoorWidthHeight: require('../models/DimDoor/DimDoorW_H_Models'),
    DoorPreHungOptions: require('../models/DimDoor/DimDoorPreHungModel'),
    DoorPreFinishingOptions: require('../models/DimDoor/DimDoorPreFinishingModel'),
    DoorSwingDirection: require('../models/DimDoor/DimDoorSwingDirectionModel'),
    DoorFrameOptions: require('../models/DimDoor/DimDoorFrameOptioModel'),
    DoorPeepView: require('../models/DimDoor/DimDoorPeepViewModel'),
    DoorHingeColor: require('../models/DimDoor/DimDoorHingeColorModel'),
    DoorSill: require('../models/DimDoor/DimDoorSillModels'),
    DoorWeatherStripColor: require('../models/DimDoor/DimDoorWeatherStripColorModule'),
    DoorGridOptions: require('../models/DimDoor/DimDoorGridOptionsModels'),
    DoorFrameExtrusion: require('../models/DimDoor/DimDoorFrameExtrusionModel'),
    DoorLockOption: require('../models/DimDoor/DimDoorLockOptionModel'),
    DoorColor: require('../models/DimDoor/DimDoorColorModel'),
    DoorWidthFrame: require('../models/DimDoor/DimDoorWidthFrameModel'),
    DoorJambSize: require('../models/DimDoor/DimDoorJambSizeModel'),
    DoorShoe: require('../models/DimDoor/DimDoorShoeModel'),
    DoorWeatherstrip: require('../models/DimDoor/DimDoorWeatherstripModel'),
    DoorHinges: require('../models/DimDoor/DimDoorHingesModel'),
    DoorBoreOptions: require('../models/DimDoor/DimDoorBoreOptionsModel'),
    DoorInstallationAvailability: require('../models/DimDoor/DimDoorInstallationAvailabilityModel'),
    DoorSideWindowOpens: require('../models/DimDoor/DimDoorSideWindowOpensModel')
};

exports.createDimDoor = async (req, res) => {
    try {
        const { modelName } = req.params;
        if (!models[modelName]) return res.status(400).json({ error: 'Invalid model name' });
        const entry = new models[modelName](req.body);
        await entry.save();
        res.status(201).json({ message: 'Entry created successfully', entry });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDimDoorByProductId = async (req, res) => {
    try {
        const { modelName, productId } = req.params;
        if (!models[modelName]) return res.status(400).json({ error: 'Invalid model name' });
        const entries = await models[modelName].find({ productId });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteDimDoor = async (req, res) => {
    try {
        const { modelName, id } = req.params;
        if (!models[modelName]) return res.status(400).json({ error: 'Invalid model name' });
        const deletedEntry = await models[modelName].findByIdAndDelete(id);
        if (!deletedEntry) return res.status(404).json({ error: 'Entry not found' });
        res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


