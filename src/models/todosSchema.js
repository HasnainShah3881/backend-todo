const { text } = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;

const TodosSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      index: true,
      unique: false,
      required: true,
      lowercase: true,
      trim: true,
    },
    Date: {
      type: String,
      default: new Date().toISOString().split("T")[0],
    },
  },
  { timestamps: true },
  {
    collection: "todos",
  }
);

const Todos = mongoose.model("Todos", TodosSchema);

module.exports = { 
    Todos ,
};
