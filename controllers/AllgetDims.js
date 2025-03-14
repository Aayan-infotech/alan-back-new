const mongoose = require('mongoose');

const dimsModels = {
    //Door
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
    DoorSideWindowOpens: require('../models/DimDoor/DimDoorSideWindowOpensModel'),
    //w
    widthHeight:  require('../models/dimsWHmodel'),
    Grid: require('../models/dimsGridModel'),
    Fin: require('../models/dimsFinModel'),
    Color: require('../models/dimsColorModel'),
    TemperingOption: require('../models/dimsTamperModel'),
    Lock: require('../models/dimsLockModel'),
    GlassType: require('../models/dimsGTypeModel'),
    PanelSpacing: require('../models/dimsPSpacingModel'),
    SideWindowOpens: require('../models/dimsSWinOpensModel'),
    installation: require('../models/dimsInstModel'),
};
const ProductModel = require('../models/ProductModel'); // Import ProductModel

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


// exports.getAllDimsByProductId = async (req, res) => {
//     try {
//         const { Product_id } = req.params;

//         // Fetch the product data using Product_id
//         const productData = await ProductModel.findById(Product_id);
//         if (!productData) {
//             return res.status(404).json({
//                 status: 404,
//                 success: false,
//                 message: "Product not found",
//             });
//         }

//         // Initialize a response object
//         let dimensionsData = {};

//         // Iterate over each model and fetch products with matching Product_id
//         for (let model in dimsModels) {
//             const data = await dimsModels[model].find({ Product_id });
//             dimensionsData[model] = data;
//         }

//         // Structure the response to include product and dimensions data
//         return res.status(200).json({
//             status: 200,
//             success: true,
//             message: "ALL Dimensions and Product fetched BY ID successfully",
//             data: {
//                 product: productData,
//                 Dimensions: dimensionsData,
//             },
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             status: 500,
//             success: false,
//             message: "Error fetching Dimensions and Product",
//         });
//     }
// };



const ProductImage = require('../models/ProductImgModel'); // Import ProductImage model

exports.getAllDimsByProductId = async (req, res) => {
    try {
        const { Product_id } = req.params;

        // Fetch the product data using Product_id
        const productData = await ProductModel.findById(Product_id);
        if (!productData) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Product not found",
            });
        }

        // Initialize a response object
        let dimensionsData = {};

        // Iterate over each model and fetch dimensions with matching Product_id
        for (let model in dimsModels) {
            // const data = await dimsModels[model].find({ Product_id });
            const data = await dimsModels[model].find({ 
                $or: [{ Product_id }, { productId: Product_id }] 
            });
            
            if (data.length > 0) {
                dimensionsData[model] = data; // Include only non-empty arrays
            }
        }

        // Fetch images associated with the Product_id
        const productImages = await ProductImage.find({ Product_id });

        // Flatten the images array to match the desired output format
        const imageUrls = productImages.flatMap((imageDoc) => imageDoc.images);

        // Structure the response to include product, dimensions, and images data
        return res.status(200).json({
            status: 200,
            success: true,
            message: "All Dimensions, Product, and Images fetched by ID successfully",
            data: {
                product: productData,
                Dimensions: dimensionsData,
                images: imageUrls, // Return a flat array of image URLs
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Error fetching Dimensions, Product, and Images",
        });
    }
};

