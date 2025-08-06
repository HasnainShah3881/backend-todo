const mongoose = require("mongoose");
require("dotenv").config();


let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hteb05l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

module.exports = { connectDB };













`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hteb05l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`