const Order = require("../models/Order");

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { items, customerEmail, customerName, totalAmount, shippingAddress } =
      req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must have items" });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = new Order({
      orderNumber,
      items,
      customerEmail,
      customerName,
      totalAmount,
      shippingAddress,
    });

    await order.save();
    res.status(201).json({ message: "Order created!", data: order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, notes } = req.body;

    const updates = {};
    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    if (notes !== undefined) updates.notes = notes;
    updates.updatedAt = Date.now();

    const order = await Order.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ message: "Order updated!", data: order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order", error: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: "Order deleted!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting order", error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};
