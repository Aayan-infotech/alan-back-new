const SubCategories = require("../models/subCategoryModels");
const Product = require('../models/ProductModel');
const SubCategory = require('../models/subCategoryModels');
const mongoose = require('mongoose');

// function to fetch subcategories by category_id
exports.getSubCategoryByCategoryId = async (req, res) => {
  try {
    const { category_id } = req.params;

    // Validate if category_id is provided
    if (!category_id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "category_id is required",
      });
    }

    // Fetch subcategories by category_id
    const subCategories = await SubCategory.find({ category_id });

    // Check if subcategories exist
    if (!subCategories.length) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "No subcategories found for the given category_id",
      });
    }

    // Transform data with isSubSubcategory determination
    const transformedData = await Promise.all(
      subCategories.map(async (subCategory) => {
        // Fetch products for the current subcategory
        const product = await Product.findOne({ sub_sub_category_id: subCategory._id });

        return {
          _id: subCategory._id,
          category_id: subCategory.category_id,
          images: [], // Replace with actual images if required
          name: subCategory.name,
          status: subCategory.status,
          type: 'subCategory',
          isSubSubcategory: !!(product && product.sub_sub_category_id && product.sub_sub_category_id !== 'null'),
        };
      })
    );

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Subcategories fetched successfully",
      data: transformedData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "An error occurred while fetching subcategories",
    });
  }
};

// Create a new SubCategories
exports.createSubCategories = async (req, res) => {
  try {
    const { image, category_id, name, status, ins_date, ins_ip, ins_by } = req.body;

    const newSubCategory = new SubCategories({
      image,
      category_id,
      name,
      status,
      ins_date,
      ins_ip,
      ins_by,
    });

    const savedSubCategory = await newSubCategory.save(); // Renamed variable here
    res.status(201).json(savedSubCategory); // Returning the saved category
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get all SubCategoriess
exports.getAllSubCategoriess = async (req, res) => {
  try {
    const SubCategoriess = await SubCategories.find().populate('category_id').populate('ins_by');
    res.status(200).json(SubCategoriess);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single SubCategories
exports.getSubCategoriesById = async (req, res) => {
  try {
    const subCategory = await SubCategories.findById(req.params.id)
      .populate('category_id')
      .populate('ins_by');
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    res.status(200).json(subCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a SubCategories
exports.updateSubCategories = async (req, res) => {
  try {
    const updatedSubCategories = await SubCategories.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSubCategories) return res.status(404).json({ message: "SubCategories not found" });
    res.status(200).json(updatedSubCategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a SubCategories
exports.deleteSubCategories = async (req, res) => {
  try {
    const deletedSubCategories = await SubCategories.findByIdAndDelete(req.params.id);
    if (!deletedSubCategories) return res.status(404).json({ message: "SubCategories not found" });
    res.status(200).json({ message: "SubCategories deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
