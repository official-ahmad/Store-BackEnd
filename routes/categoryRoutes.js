const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/create", verifyToken, createCategory);
router.get("/all", getAllCategories);
router.put("/update/:id", verifyToken, updateCategory);
router.delete("/delete/:id", verifyToken, deleteCategory);

module.exports = router;
