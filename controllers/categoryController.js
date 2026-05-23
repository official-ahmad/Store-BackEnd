const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const category = new Category({
      name,
      slug,
      description,
      icon,
    });

    await category.save();
    res.status(201).json({ message: "Category created!", data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category already exists" });
    }
    res
      .status(500)
      .json({ message: "Error creating category", error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon } = req.body;

    const updates = { updatedAt: Date.now() };
    if (name) {
      updates.name = name;
      updates.slug = name.toLowerCase().replace(/\s+/g, "-");
    }
    if (description !== undefined) updates.description = description;
    if (icon !== undefined) updates.icon = icon;

    const category = await Category.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res.status(200).json({ message: "Category updated!", data: category });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};
