const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hteb05l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    );
    console.log(` Connected to MongoDB Database: ${process.env.DB_NAME}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

module.exports = { connectDB };
