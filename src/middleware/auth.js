const jwt = require("jsonwebtoken");
const {User} = require("../models/userSchema");


const userAuth = async(req ,res ,next )=>{

      try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token is not valid!!!!!!!!!");
        }

        const decodedObj = await jwt.verify(token, process.env.SECRET_KEY);

        const { id } = decodedObj;                              
        console.log(id);
        
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        console.log(user)
        req.user = user

        next()

}

 catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }




}

module.exports = {

    userAuth,
};