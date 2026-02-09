const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.post("/add", addProduct); // Create
router.get("/all", getAllProducts); // Read
router.put("/update/:id", updateProduct); // Update
router.delete("/delete/:id", deleteProduct); // Delete

module.exports = router;
