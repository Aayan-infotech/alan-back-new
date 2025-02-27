const Product = require('../models/ProductModel');
const subCategory = require('../models/subCategoryModels');

// controllers/categoryController.js

const Category = require('../models/categoriesModels');
const uploadImages = require("../middlewares/upload");
exports.createCategory = async (req, res) => {
  try {
    // Call the reusable uploadImages function
    // const imagePaths = await uploadImages(req);
    const imagePaths = req.fileLocations;
    const { name, status, ins_ip, ins_by } = req.body;

    const newCategory = new Category({
      images: imagePaths,
      name,
      status,
      ins_ip,
      ins_by,
    });

    await newCategory.save();

    res.status(201).json({
      message: "Category created successfully",
      newCategory,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Create a new category
// exports.createCategory = async (req, res) => {
//   try {
//     const { image, name, status, ins_ip, ins_by } = req.body;

//     const newCategory = new Category({
//       image,
//       name,
//       status,
//       ins_ip,
//       ins_by,
//     });

//     await newCategory.save();
//     res.status(201).json({ message: 'Category created successfully', newCategory });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

/*
exports.getCategories = async (req, res) => {
  try {
    // Fetch categories and populate the ins_by and update_by fields
    const categories = await Category.find().populate('ins_by update_by');
    
    // Respond with the categories data
    res.status(200).json({
      status: 200,
      success: true,
      message: "Categories fetched successfully",
      data: categories, // Ensure this is the categories data
    });
  } catch (error) {
    // Send an error response if there’s an issue
    res.status(500).json({ error: error.message });
  }
};

*/



// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('ins_by update_by');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('ins_by update_by');
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const imagePaths = req.fileLocations;
    const { image, name, status, update_ip, update_by } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        images: imagePaths,
        name,
        status,
        update_date: Date.now(),
        update_ip,
        update_by,
      },
      { new: true }
    );

    if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json({ message: 'Category updated successfully', updatedCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.updateCategory = async (req, res) => {
//     try {
//       const { name, status, update_ip, update_by } = req.body;
//       const imagePath = req.file ? req.file.path : null; // New image path if uploaded

//       const updateData = {
//         ...(name && { name }),
//         ...(status !== undefined && { status }),
//         ...(update_ip && { update_ip }),
//         ...(update_by && { update_by }),
//         update_date: Date.now(),
//       };

//       // If a new image is uploaded, update the images field
//       if (imagePath) {
//         updateData.images = [imagePath];
//       }

//       const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });

//       if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });

//       res.status(200).json({ message: 'Category updated successfully', updatedCategory });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//wab APPS API

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    // If no categories are found, return an appropriate message
    if (!categories || categories.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'No categories found'
      });
    }

    const categoryData = [];

    // Loop through each category to find its subcategory
    for (let category of categories) {
      // Find a subcategory by matching the category_id
      const subCategoryDoc = await subCategory.findOne({ category_id: category._id });

      // Check if subCategory exists, then set isSubCategory flag
      const isSubCategory = subCategoryDoc ? true : false;

      // Push category data with the `isSubCategory` flag
      categoryData.push({
        _id: category._id,
        images: category.images,
        name: category.name,
        status: category.status,
        type: 'category',
        isSubCategory: isSubCategory,
      });
    }

    // Return the successful response with the category data
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Categories fetched successfully',
      data: categoryData
    });

  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      status: 500,
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};


exports.updateStatus = async (req, res) => {
  try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status value (only 0 or 1 allowed)
      if (![0, 1].includes(status)) {
          return res.status(400).json({ message: 'Invalid status value. Allowed values: 0 or 1' });
      }

      // Find and update the category status
      const category = await Category.findByIdAndUpdate(
          id,
          { status, update_date: Date.now() },
          { new: true }
      );

      if (!category) {
          return res.status(404).json({ message: 'Category not found' });
      }

      res.status(200).json({ message: 'Status updated successfully', category });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};