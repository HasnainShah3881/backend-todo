const express = require("express");
const app = express();
const Authrouter = require("./router/auth");
const Datarouter = require("./router/data");
const Usersrouter = require("./router/users");
const cors = require("cors");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const { locales } = require("validator/lib/isIBAN");
// const serverless = require("serverless-http");

const port = 3000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://todo-website-iota.vercel.app"
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed from this origin: " + origin));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
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

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
