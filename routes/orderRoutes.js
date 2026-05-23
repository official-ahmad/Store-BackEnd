const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
} = require("../controllers/orderController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/create", createOrder);
router.get("/all", getAllOrders);
router.get("/:id", getOrderById);
router.put("/update/:id", verifyToken, updateOrderStatus);
router.delete("/delete/:id", verifyToken, deleteOrder);

module.exports = router;
