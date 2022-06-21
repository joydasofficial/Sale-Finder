const jwt = require("jsonwebtoken");

const User = require("../models/User.model");

exports.protect = async (req, res, next) =>{
    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        res.status(401).json({message: "Not authorized to access this route"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            res.status(400).json({success: false, message: "Invaild token"})
        }

        const user = await User.findById(decoded.id);

        if(!user){
            res.status(404).json({message: "User not found"});
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
    }
}