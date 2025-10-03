const express = require("express");
const { userAuth } = require("../middleware/auth");
const Usersrouter = express.Router();
const { User } = require("../models/userSchema");
const mongoose = require("mongoose");


// Usersrouter.get("/getAllUser", (req, res) => {
//   res.send("get all users success fully");
// });

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
      bio: user.bio,
      _id: user._id,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error fetching user." });
  }
});




Usersrouter.patch("/updateUser/:id", async (req, res) => {
  try {
    let { id } = req.params;
    id = id.replace(":", "").trim(); // ✅ remove unwanted colon

    console.log("Cleaned ID:", id, "Length:", id.length);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID." });
    }

    const { firstname, lastname, bio } = req.body;

    if (!firstname && !lastname && !bio) {
      return res.json({
        success: false,
        message: "At least one field (firstname, lastname, bio) is required.",
      });
    }

    const updateFields = {};
    if (firstname) updateFields.firstname = firstname;
    if (lastname) updateFields.lastname = lastname;
    if (bio) updateFields.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: updatedUser,  
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});



module.exports = Usersrouter;
