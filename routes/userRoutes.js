const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  getWalletBalance,
} = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (require user to be logged in)
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateProfile);

// Cart routes
router.post("/cart/add", verifyToken, addToCart);
router.get("/cart", verifyToken, getCart);
router.post("/cart/remove", verifyToken, removeFromCart);
router.post("/cart/clear", verifyToken, clearCart);

// Wallet routes
router.get("/wallet", verifyToken, getWalletBalance);

module.exports = router;
