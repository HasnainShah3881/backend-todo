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
      return res
        .status(400)
        .json({ success: false, message: "First and last name are required." });
    }
    if (!email || !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing email address." });
    }
    if (!password || !validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password is not strong enough. Include uppercase, lowercase, numbers, and symbols.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists." });
    }

    const passwordhashed = await bcrypt.hash(password, 10);

    const user = new User({
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
    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).send("Email already in use, please use a different email");
  }
});

Authrouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    // console.log(user)
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please sign up first." });
    }
    const ispasswordvalid = await bcrypt.compare(password, user.password);
    if (!ispasswordvalid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in: " + error.message });
  }
});
Authrouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      expires: new Date(Date.now() * 0), //0 min
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error logging out" });
  }
});

module.exports = Authrouter;
