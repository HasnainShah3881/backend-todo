const express = require("express")
const { userAuth } = require("../middleware/auth")
const Usersrouter = express.Router()

Usersrouter.get("/getAllUser" , (req , res )=>{
    res.send("get all users success fully")
})

Usersrouter.get("/getUser" , userAuth , async(req , res )=>{
    try {
        const user = req.user;
        if(!user){
        throw new Error("user is not found")
        }
        res.status(200).json(user);
        res.send( user )
    } catch (error) {
        res.status(400)
        console.log(error)
    }
})

module.exports = Usersrouter