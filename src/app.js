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
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
  "https://todo-website-iota.vercel.app",
  'http://localhost:3000'
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
app.use("/Auth", Authrouter);
app.use("/Data", Datarouter);
app.use("/Users", Usersrouter);

connectDB()
 .then(()=>{
    console.log("database connected successfully")
  }).catch((err)=>{
    console.log('database connection failed',err)
})

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
