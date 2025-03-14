const Product = require('../models/ProductModel');
const subsubCategorySchema = require("../models/subSubCategoryModels");
const categories = require("../models/categoriesModels");
const subCategories = require("../models/subCategoryModels");


// POST method to create a new product
exports.createProduct = async (req, res) => {
  const imagePaths = req.fileLocations;
  const { price, category_id, sub_category_id, sub_sub_category_id, name, Description, ins_date, ins_ip, ins_by, productFormulaAdded } = req.body;

  try {
    const newProduct = new Product({
      images: imagePaths,
      price: price || null,
      category_id,
      sub_category_id: sub_category_id || null, // If sub_category_id is not provided, set to null
      sub_sub_category_id: sub_sub_category_id || null,
      name,
      Description,
      ins_date: ins_date || Date.now(),  // Set default value to current date if not provided
      ins_ip,
      ins_by: ins_by || null, // If ins_by is not provided, set to null
      productFormulaAdded: productFormulaAdded || 'No', // Default to 'No' if not provided
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


exports.getProductByTypeAndId = async (req, res) => {
  try {
    const { type, id } = req.params;

    // Validate the type
    if (!['category', 'subCategory', 'subSubCategory'].includes(type)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid type. Allowed values are 'category', 'subCategory', or 'subSubCategory'.",
      });
    }

    // Build the filter based on the type
    const filter = {};
    if (type === 'category') {
      filter.category_id = id;
    } else if (type === 'subCategory') {
      filter.sub_category_id = id;
    } else if (type === 'subSubCategory') {
      filter.sub_sub_category_id = id;
    }

    // Fetch products based on the filter
    const products = await Product.find(filter);

    // Check if products exist
    if (!products.length) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: `No products found for the given ${type} ID.`,
      });
    }

    // Format the response
    const formattedProducts = products.map(product => ({
      _id: product._id,
      images: product.images,
      price: product.price,
      name: product.name,
      description: product.Description,
      sku: product.sku,
      ins_date: product.ins_date,
      ins_ip: product.ins_ip,
      ins_by: product.ins_by ? product.ins_by.name : "Unknown", // Assuming `ins_by` references a user
    }));

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Products fetched successfully",
      data: formattedProducts,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "An error occurred while fetching products",
    });
  }
};  


// DELETE method to delete a product by ID
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT method to update a product by ID
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully', product });
    console.log('Update data:', updateData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search API for product name or SKU
exports.searchProduct = async (req, res) => {
  try {
      const { name, category_id } = req.query;

      // Build the query dynamically based on the provided parameters
      let query = {};
      if (category_id) {
          query.category_id = category_id; // Match category_id exactly
      }
      if (name) {
          query.name = { $regex: name, $options: 'i' }; // Case-insensitive search on product name
      }

      const products = await Product.find(query);

      if (products.length === 0) {
          return res.status(404).json({ 
              status: 404,
              success: false,
              message: 'No products found',
              data: []
          });
      }

      return res.status(200).json({ 
          status: 200,
          success: true,
          message: 'Products fetched successfully',
          data: products 
      });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ 
          status: 500,
          success: false,
          message: 'Server error',
          error: err.message 
      });
  }
};

// getProductsbyid
exports.getProductsbyid = async (req, res) => { 
  try {
      // Extract the product ID from the request params
      const productId = req.params.id;

      // Check if the productId is provided
      if (!productId) {
          return res.status(400).json({ message: "Product ID is required" });
      }

      // Find the product by ID in the database
      const product = await Product.findById(productId);

      // If product not found, send a 404 response
      if (!product) {
          return res.status(404).json({ message: "Product not found" });
      }

      // Send a successful response with the product data
      return res.status(200).json(product);
  } catch (err) {
      // Handle any errors that may occur
      console.error(err);
      return res.status(500).json({ message: "Server error" });
  }
};