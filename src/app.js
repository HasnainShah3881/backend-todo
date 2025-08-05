const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const serverless = require("serverless-http");
const { connectDB } = require("./config/database");

const Authrouter = require("./router/auth");
const Datarouter = require("./router/data");
const Usersrouter = require("./router/users");

const app = express();

app.use(cors({
  origin: "https://todo-website-iota.vercel.app",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

let handler;

async function getHandler() {
  if (!handler) {
    try {
      await connectDB();
      console.log("✅ Connected to MongoDB");

      // 🔁 Optional test route
      app.get("/", (req, res) => {
        res.send("✅ Server is live!");
      });

      app.use("/Auth", Authrouter);
      app.use("/Data", Datarouter);
      app.use("/Users", Usersrouter);

      handler = serverless(app);
    } catch (error) {
      console.error("❌ Error connecting to MongoDB:", error.message);
      throw error;
    }
  }
  return handler;
}

module.exports.handler = async (event, context) => {
  console.log("🚀 Serverless function triggered");
  const h = await getHandler();
  return h(event, context);
};
