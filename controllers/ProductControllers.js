const Product = require('../models/ProductModel');
const subsubCategorySchema = require("../models/subSubCategoryModels");
const categories=require("../models/categoriesModels");
const subCategories=require("../models/subCategoryModels");


// POST method to create a new product
exports.createProduct = async (req, res) => {
    const { image, price, category_id, sub_category_id, sub_sub_category_id, name, Description, ins_date, ins_ip, ins_by } = req.body;

    try {
        const newProduct = new Product({
            image,
            price: price || null,
            category_id,
            sub_category_id: sub_category_id || null, // If sub_category_id is not provided, set to null
            sub_sub_category_id: sub_sub_category_id || null,
            name,
            Description,
            ins_date: ins_date || Date.now(),  // Set default value to current date if not provided
            ins_ip,
            ins_by: ins_by || null, // If ins_by is not provided, set to null
        });

        // Save product to database
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


// GET method to retrieve all products
// exports.getProducts = async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.status(200).json(products);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };




// Get all products and populate category, sub-category, and sub-sub-category names

exports.getProducts = async (req, res) => {
    try {
      // Step 1: Get all products
      const products = await Product.find();
  
      // Step 2: Map through products and manually fetch category, sub-category, and sub-sub-category data
      const formattedData = await Promise.all(products.map(async (item) => {
        // Fetch category by id
        const category = await categories.findById(item.category_id);
        // Fetch sub-category by id
        const subCategory = await subCategories.findById(item.sub_category_id);
        // Fetch sub-sub-category by id
        const subSubCategory = await subsubCategorySchema.findById(item.sub_sub_category_id);
  
        // Prepare formatted response with category_name, sub_category_name, and sub_sub_category_name
        return {
          _id: item._id,
          image: item.image,
          price: item.price,
          name: item.name,
          description: item.Description,
          sku: item.sku,
          ins_date: item.ins_date,
          ins_ip: item.ins_ip,
          ins_by: item.ins_by ? item.ins_by.name : "Unknown", // Assuming ins_by is a user reference
          
          // Manually fetching names from related collections
          category_name: category ? category.name : "Unknown",  // If category not found, return "Unknown"
          sub_category_name: subCategory ? subCategory.name : "Unknown",  // If sub-category not found, return "Unknown"
          sub_sub_category_name: subSubCategory ? subSubCategory.name : "Unknown"  // If sub-sub-category not found, return "Unknown"
        };
      }));
  
      // Step 3: Send formatted data as response
      res.status(200).json(formattedData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };
