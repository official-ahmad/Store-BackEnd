require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const connectDB = require("./db");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./Admin-CRUD/routes/productRoutes");

// const adminRoutes = require("./Admin-CRUD/routes/productRoutes");

const port = process.env.PORT;

// 1. DB-connection
connectDB();

// 2. Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// 3. Routes
// URL: http://localhost:8000/api/admin/add - to add products!
app.use("/api/admins", adminRoutes);
app.use("/api/admin/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
