const Product = require('../models/ProductModel');


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
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
