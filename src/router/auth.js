const express = require("express");
const Authrouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { User } = require("../models/userSchema");
require("dotenv").config();
Authrouter.post("/signup", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname) {
      throw new Error("name is not found");
    } else if (!validator.isEmail(email)) {
      throw new Error("email is not found");
    } else if (!validator.isStrongPassword(password)) {
      throw new Error("please enter strong password");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already in use, please use a different email");
    }

    const passwordhashed = await bcrypt.hash(password, 10);

    const user = await User({
      firstname,
      lastname,
      email,
      password: passwordhashed,
    });
    user.save();
    // const token = await jwt.sign({id: user._id},"hasnain123", {expiresIn:"1d"})
    // res.cookie("token",token , {
    //   expires:new Date(Date.now()+60*10000)//10 min
    // })
    if (!user._id) {
      throw new Error("some thing wrong");
    }
    res.send("signup successfully");
  } catch (error) {
    res.status(400).send("Email already in use, please use a different email");
  }
});

Authrouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    // console.log(user)
    if (!user) {
      throw new Error("user is not found");
    }
    const ispasswordvalid = await bcrypt.compare(password, user.password);
    if (!ispasswordvalid) {
      throw new Error("password is invalid");
    }
    const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    });

    res.send("login success fully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});
Authrouter.post("/logout", async (req, res) => {
  // const token = await jwt.sign({id: user._id},"hasnain123", {expiresIn:"1d"})
  res.cookie("token", null, {
    expires: new Date(Date.now() * 0), //0 min
  });

  res.send("logout successfully");
});

module.exports = Authrouter;
