const subsubCategorySchema = require("../models/subSubCategoryModels");
const categories=require("../models/categoriesModels");
const subCategories=require("../models/subCategoryModels");


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
    const subsubCategorySchemas = await subsubCategorySchema.find().populate('ins_by');
    
    const categoryIds = subsubCategorySchemas.map(item => item.category_id);
    const subCategoryIds = subsubCategorySchemas.map(item => item.sub_category_id);

    const categoriesData = await categories.find({ '_id': { $in: categoryIds } });
    const subCategoriesData = await subCategories.find({ '_id': { $in: subCategoryIds } });

    const formattedData = subsubCategorySchemas.map(item => {
      const category = categoriesData.find(cat => cat._id.toString() === item.category_id.toString());
      const subCategory = subCategoriesData.find(subCat => subCat._id.toString() === item.sub_category_id.toString());
      
      return {
        _id: item._id,
        image: item.image,
        category_name: category ? category.name : "Unknown",
        sub_category_name: subCategory ? subCategory.name : "Unknown",
        name: item.name,
        status: item.status,
        ins_date: item.ins_date,
        ins_ip: item.ins_ip,
        ins_by: item.ins_by,
        update_date: item.update_date,
        update_by: item.update_by,
        update_ip: item.update_ip,
      };
    });

    res.status(200).json(formattedData);
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
