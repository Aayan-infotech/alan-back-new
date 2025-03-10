const SubCategory = require('../models/subCategoryModels');
const subSubCategory = require('../models/subSubCategoryModels');
const Product = require('../models/ProductModel');

// exports.searchByName = async (req, res) => {
//     try {
//         const { name } = req.query;
//         if (!name) {
//             return res.status(400).json({
//                 status: 400,
//                 success: false,
//                 message: "Name query parameter is required",
//                 data: [],
//             });
//         }

//         // Case-insensitive regex search for name
//         const query = { name: { $regex: name, $options: 'i' } };

//         const [subCategories, subSubCategories, products] = await Promise.all([
//             SubCategory.find(query),
//             subSubCategory.find(query),
//             Product.find(query),
//         ]);

//         res.status(200).json({
//             status: 200,
//             success: true,
//             message: "Search results retrieved successfully",
//             data: { subCategories, subSubCategories, products },
//         });
//     } catch (error) {
//         console.error("Search API Error:", error);
//         res.status(500).json({
//             status: 500,
//             success: false,
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// };



// exports.searchByName = async (req, res) => {
//     try {
//         const { name } = req.query;

//         if (!name) {
//             return res.status(400).json({
//                 status: 400,
//                 success: false,
//                 message: "Name query parameter is required",
//                 data: [],
//             });
//         }

//         const query = { name: { $regex: name, $options: 'i' } };
//         const [subCategories, subSubCategories, products] = await Promise.all([
//             SubCategory.find(query),
//             subSubCategory.find(query),
//             Product.find(query),
//         ]);

//         // Check if all are empty
//         if (!subCategories.length && !subSubCategories.length && !products.length) {
//             return res.status(200).json({
//                 status: 200,
//                 success: true,
//                 message: "No data available for this search",
//                 data: [],
//             });
//         }

//         // Add `isSubSubCategory` key
//         const isSubSubCategory = subSubCategories.length > 0;
//         subCategories.push.isSubSubCategory

//         // Return search results
//         res.status(200).json({
//             status: 200,
//             success: true,
//             message: "Search results retrieved successfully",
//             data: { subCategories, subSubCategories, products, isSubSubCategory },
//         });

//     } catch (error) {
//         res.status(500).json({
//             status: 500,
//             success: false,
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// };


exports.searchByName = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Name query parameter is required",
                data: [],
            });
        }

        const query = { name: { $regex: name, $options: 'i' } };
        const [subCategories, subSubCategories, products] = await Promise.all([
            SubCategory.find(query),
            subSubCategory.find(query),
            Product.find(query),
        ]);

        // Check if all are empty
        if (!subCategories.length && !subSubCategories.length && !products.length) {
            return res.status(200).json({
                status: 200,
                success: true,
                message: "No data available for this search",
                data: [],
            });
        }

        // Add `isSubSubCategory` key in each `subCategory`
        const updatedSubCategories = subCategories.map(subCategory => {
            const hasSubSubCategory = subSubCategories.some(subSub => 
                subSub.sub_category_id.toString() === subCategory._id.toString()
            );
            return { ...subCategory.toObject(), isSubSubCategory: hasSubSubCategory };
        });

        // Return search results
        res.status(200).json({
            status: 200,
            success: true,
            message: "Search results retrieved successfully",
            data: { subCategories: updatedSubCategories, subSubCategories, products },
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
