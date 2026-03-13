const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const verifyToken = require("../../middleware/authMiddleware");

router.get("/all", getAllProducts);
router.post("/add", verifyToken, addProduct);
router.put("/update/:id", verifyToken, updateProduct);
router.delete("/delete/:id", verifyToken, deleteProduct);

module.exports = router;
