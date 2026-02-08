const mongoose = require("mongoose");
require("dotenv").config();

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("DB connected successfully!");
    })
    .catch((err) => {
      console.log(`${err}`);
    });
}
module.exports = connectDB;
