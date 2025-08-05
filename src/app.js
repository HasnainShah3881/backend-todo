const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const serverless = require("serverless-http");
const { connectDB } = require("./config/database");

const Authrouter = require("./router/auth");
const Datarouter = require("./router/data");
const Usersrouter = require("./router/users");

const app = express();

app.use(
  cors({
    origin: "https://todo-website-iota.vercel.app",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// 👇 Wrap export inside a function to wait for DB connection
let handler;

const startApp = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Register routes AFTER DB connection
    app.use("/Auth", Authrouter);
    app.use("/Data", Datarouter);
    app.use("/Users", Usersrouter);

    handler = serverless(app);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
  }
};

startApp();

module.exports.handler = async (event, context) => {
  if (!handler) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server not initialized" }),
    };
  }
  return handler(event, context);
};
