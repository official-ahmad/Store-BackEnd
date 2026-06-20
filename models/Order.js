const mongoose = require("mongoose"); // Import "mongoose" from Backend Server Cors

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      title: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  customerEmail: { type: String, required: true },
  customerName: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid", "refunded"],
    default: "unpaid",
  },
  paymentMethod: {
    type: String,
    enum: ["wallet", "cash", "card"],
    default: "wallet",
  },
  shippingAddress: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);

