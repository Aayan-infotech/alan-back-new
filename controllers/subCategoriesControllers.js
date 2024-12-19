const SubCategories = require("../models/subCategoryModels");


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
