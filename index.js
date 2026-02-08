require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const connectDB = require("./db");
const adminRoutes = require("./routes/adminRoutes");
const port = process.env.PORT;

// 1. DB-connection
connectDB();

// 2. Middlewares (as a json format for postman)
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// 3. Routes
app.use("/api/admins", adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
