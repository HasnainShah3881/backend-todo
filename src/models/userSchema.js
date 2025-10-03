const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    lastname: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      unique: true,
      index: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("please enter strong password");
        }
      },
    },
    bio:{
      type: String,
      minLength: 10,
      maxLength: 300,
      required: false,
      default: "No bio provided."
    }
  },
  {
    collection: "Users",
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
};
