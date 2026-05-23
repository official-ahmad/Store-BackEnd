require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const connectDB = require("./db");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./Admin-CRUD/routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");

const port = process.env.PORT;

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: ["https://store-products-six.vercel.app", "http://localhost:5173"],
  }),
);

app.use("/api/admins", adminRoutes);
app.use("/api/admin/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/checkout", checkoutRoutes);

app.get("/", (req, res) => res.send("Server is running!"));

app.listen(port, () => console.log(`Server is running on port ${port}`));
