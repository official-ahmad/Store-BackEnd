const express = require("express");
const router = express.Router();
const {
  checkout,
  getUserOrders,
  addWalletBalance,
  getTransactionHistory,
} = require("../controllers/checkoutController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/checkout", verifyToken, checkout);
router.get("/my-orders", verifyToken, getUserOrders);
router.post("/add-wallet", verifyToken, addWalletBalance);
router.get("/transaction-history", verifyToken, getTransactionHistory);

module.exports = router;
