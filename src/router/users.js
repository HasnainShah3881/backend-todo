const express = require("express");
const { userAuth } = require("../middleware/auth");
const Usersrouter = express.Router();

Usersrouter.get("/getAllUser", (req, res) => {
  res.send("get all users success fully");
});

Usersrouter.get("/getUser", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    res.status(200).json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error fetching user." });
    console.log(error);
  }
});

module.exports = Usersrouter;
