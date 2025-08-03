const express = require("express");
const Datarouter = express.Router();

Datarouter.get("/getAlldata", (req, res) => {
  res.send("get all data successully");
});

Datarouter.post("/addData", (req, res) => {
  res.send("get all add data successully");
});

Datarouter.delete("/deleteData", (req, res) => {
  res.send("get all delete data successully");
});

Datarouter.patch("/updateData", (req, res) => {
  res.send("get all update data successully");
});

module.exports = Datarouter;
