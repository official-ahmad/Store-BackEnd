const Product = require("../models/productModel");

// 1. CREATE 
exports.addProduct = async (req, res) => {
  try {
    const data = req.body;

    if (Array.isArray(data)) {
      const savedProducts = await Product.insertMany(data);
      return res.status(201).json({
        message: "All products added successfully!",
        count: savedProducts.length,
        data: savedProducts,
      });
    }

    const newProduct = new Product(data);
    await newProduct.save();
    res.status(201).json({ message: "Product Added!", data: newProduct });
  } catch (error) {
    res.status(500).json({
      message: "Error in Creating Product",
      error: error.message,
    });
  }
};

// 2. READ: Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error in Fetching Products",
      error: error.message,
    });
  }
};

// 3. UPDATE: Edit product on the basis of ID
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "Product Updated Successfully!",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Product update failed!",
      error: error.message,
    });
  }
};

// 4. DELETE: Remove product on the basic of ID
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product Deleted!" });
  } catch (error) {
    res.status(500).json({
      message: "Cannot Delete the Product",
      error: error.message,
    });
  }
};
