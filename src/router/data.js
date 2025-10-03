const express = require("express");
const Datarouter = express.Router();
const { Todos } = require("../models/todosSchema");
const { userAuth } = require("../middleware/auth");

Datarouter.get("/getAlldata", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const alldata = await Todos.find({ email: user.email }).sort({ createdAt: -1 });
    res.status(200).json(alldata);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

Datarouter.post("/addData", async (req, res) => {
  try {
    const { text, email, date } = req.body;
    if (!text || !email || !date) {
      return res
        .status(400)
        .json({ message: "Text, email and date are required." });
    }
    const newTodo = await Todos({ text, email, date });
    newTodo.save();
    res.status(201).json({success:true, message: "Data added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

Datarouter.delete("/deleteData/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is required." });
    }
    const deletedTodo = await Todos.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Data not found." });
    }
    res.status(200).json({ message: "Data deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

Datarouter.patch("/updateData/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!id || !text) {
      return res.json({ message: "ID and text are required.", success: false });
    }
    if (text.length > 30) {
      return res.json({ message: "text is too long. Max length is 30 characters.", success: false });
    }
    const updatedTodo = await Todos.findByIdAndUpdate(id, { text });
    if (!updatedTodo) {
      return res.json({ message: "Data not found.", success: false });
    }
    res
      .status(200)
      .json({ message: "Data updated successfully.", data: updatedTodo  , success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", success: false });
  }
});

module.exports = Datarouter;
