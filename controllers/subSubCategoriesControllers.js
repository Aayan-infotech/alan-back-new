const subsubCategorySchema = require("../models/subSubCategoryModels");


// Create a new subsubCategorySchema
exports.createsubsubCategorySchema = async (req, res) => {
    try {
      const { image, category_id, sub_category_id, name, status, ins_date, ins_ip, ins_by } = req.body;
      
      const newsubSubCategory = new subsubCategorySchema({
        image,
        category_id,
        sub_category_id,
        name,
        status,
        ins_date,
        ins_ip,
        ins_by,
      });
  
      const savedSubCategory = await newsubSubCategory.save(); // Renamed variable here
      res.status(201).json(savedSubCategory); // Returning the saved category
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

// Get all subsubCategorySchemas
exports.getAllsubsubCategorySchemas = async (req, res) => {
  try {
    const subsubCategorySchemas = await subsubCategorySchema.find().populate('category_id').populate('ins_by');
    res.status(200).json(subsubCategorySchemas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single subsubCategorySchema
exports.getsubsubCategorySchemaById = async (req, res) => {
    try {
      const subCategory = await subsubCategorySchema.findById(req.params.id)
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

// Update a subsubCategorySchema
exports.updatesubsubCategorySchema = async (req, res) => {
  try {
    const updatedsubsubCategorySchema = await subsubCategorySchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedsubsubCategorySchema) return res.status(404).json({ message: "subsubCategorySchema not found" });
    res.status(200).json(updatedsubsubCategorySchema);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a subsubCategorySchema
exports.deletesubsubCategorySchema = async (req, res) => {
  try {
    const deletedsubsubCategorySchema = await subsubCategorySchema.findByIdAndDelete(req.params.id);
    if (!deletedsubsubCategorySchema) return res.status(404).json({ message: "subsubCategorySchema not found" });
    res.status(200).json({ message: "subsubCategorySchema deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
