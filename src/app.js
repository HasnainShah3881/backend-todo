const express = require("express");
const app = express();
const Authrouter = require("./router/auth");
const Datarouter = require("./router/data");
const Usersrouter = require("./router/users");
const cors = require("cors");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");


// const port = 3000;
app.use(
  cors({
    origin: "https://todo-website-iota.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());




app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection error in middleware:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use("/Auth", Authrouter);
app.use("/Data", Datarouter);
app.use("/Users", Usersrouter);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.error("Error connecting to MongoDB");
  });

module.exports = app;
