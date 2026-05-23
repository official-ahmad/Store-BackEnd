const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: String,
    address: String,
    walletBalance: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    cart: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        title: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        image: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
