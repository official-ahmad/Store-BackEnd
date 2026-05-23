const User = require("../models/User");
const Order = require("../models/Order");
const WalletTransaction = require("../models/WalletTransaction");

exports.checkout = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (user.walletBalance < totalAmount) {
      return res.status(400).json({
        message: "Insufficient wallet balance",
        required: totalAmount,
        available: user.walletBalance,
      });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    const order = new Order({
      orderNumber,
      userId,
      items,
      customerEmail: user.email,
      customerName: user.name,
      totalAmount,
      shippingAddress,
      paymentMethod: "wallet",
      paymentStatus: "paid",
      status: "processing",
    });

    await order.save();

    const balanceBefore = user.walletBalance;
    user.walletBalance -= totalAmount;
    user.totalSpent += totalAmount;
    user.orders.push(order._id);
    user.cart = [];

    await user.save();

    const transaction = new WalletTransaction({
      userId,
      type: "debit",
      amount: totalAmount,
      reason: "Product Purchase",
      orderId: order._id,
      balanceBefore,
      balanceAfter: user.walletBalance,
      description: `Purchase of ${items.length} item(s) - Order ${orderNumber}`,
    });

    await transaction.save();

    res.status(201).json({
      message: "Order placed successfully!",
      order,
      newWalletBalance: user.walletBalance,
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Checkout failed", error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

exports.addWalletBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(userId);
    const balanceBefore = user.walletBalance;

    user.walletBalance += amount;
    await user.save();

    const transaction = new WalletTransaction({
      userId,
      type: "credit",
      amount,
      reason: "Wallet Recharge",
      balanceBefore,
      balanceAfter: user.walletBalance,
      description: `Added Rs. ${amount} to wallet`,
    });

    await transaction.save();

    res.status(200).json({
      message: "Wallet updated successfully!",
      newBalance: user.walletBalance,
      transaction,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating wallet", error: error.message });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await WalletTransaction.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transactions", error: error.message });
  }
};
