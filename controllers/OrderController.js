const CustomerManage = require('../models/CustMngModel');
const Product = require('../models/ProductModel');
const mongoose = require('mongoose');
const Order = require("../models/OrderModel");

// POST API to create an order
// exports.createOrder = async (req, res) => {
//     // const imagePaths = req.fileLocations; :imagePaths
//     try {
//       const {
//         user_id,
//         totalPrice,
//         product_price,
//         product_id,
//         name,
//         sku,
//        images,
//         selectedOptions,
//         customDimensions,
//       } = req.body;

//       // Validate `user_id` in `CustomerManage`
//       const userExists = await CustomerManage.findById(user_id);
//       if (!userExists) {
//         return res.status(400).json({ message: "Invalid user_id" });
//       }

//       // Validate `product_id`, `name`, and `sku` in `Product`
//    /*   const productExists = await Product.findOne({
//         _id: product_id,
//         name: name,
//         sku: sku,
//       });
//       if (!productExists) {
//         return res.status(400).json({ message: "Invalid product details" });
//       } */

//       // Transform `selectedOptions` to only include level and name
//       const transformedOptions = Object.entries(selectedOptions).map(([level, details]) => ({
//         level,
//         name: details.name,
//       }));

//       // Prepare the order data
//       const newOrder = new Order({
//         user_id,
//         totalPrice,
//         product_price,
//         product_id,
//         name,
//         sku,
//         images,
//         selectedOptions: transformedOptions,
//         customDimensions,
//       });

//       // Save to the database
//       await newOrder.save();

//       res.status(201).json({
//         message: "Order created successfully",
//         order: newOrder,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "An error occurred", error });
//     }
//   };


exports.createOrder = async (req, res) => {
    try {
        // Extract data from the request body
        const {
            user_id,
            totalPrice,
            product_price,
            product_id,
            name,
            sku,
            images,
            selectedOptions,
            customDimensions
        } = req.body;

        // Process selectedOptions to only store the 'name' and ignore 'value'
        const processedSelectedOptions = {};
        for (const [key, option] of Object.entries(selectedOptions)) {
            // Only store the 'name' field from each option (ignoring 'value')
            processedSelectedOptions[key] = option.name;
        }

        // Create a new order instance using the provided data
        const newOrder = new Order({
            user_id,
            totalPrice,
            product_price,
            product_id,
            name,
            sku,
            images,
            selectedOptions: processedSelectedOptions, // Only store 'name' from each selected option
            customDimensions,
        });

        // Save the new order to the database
        await newOrder.save();

        // Send a success response
        res.status(201).json({
            message: 'Order created successfully!',
            order: newOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating order',
            error: error.message,
        });
    }
};
