const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      walletBalance: 1000,
    });

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      success: true,
      message: "Registration successful! Welcome to your store",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletBalance: user.walletBalance,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletBalance: user.walletBalance,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    });
    res.status(200).json({ message: "Profile updated!", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, title, price, image, quantity = 1 } = req.body;
    const user = await User.findById(req.user.id);

    const existingItem = user.cart.find(
      (item) => item.productId?.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, title, price, image, quantity });
    }

    await user.save();
    res.status(200).json({ message: "Added to cart", cart: user.cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(
      (item) => item.productId?.toString() !== productId,
    );
    await user.save();
    res.status(200).json({ message: "Removed from cart", cart: user.cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing from cart", error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};

exports.getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      walletBalance: user.walletBalance,
      totalSpent: user.totalSpent,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching wallet", error: error.message });
  }
};
