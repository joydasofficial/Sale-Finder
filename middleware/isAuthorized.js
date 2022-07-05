const jwt = require("jsonwebtoken");
const { rule } = require('graphql-shield');

const isAuthorized = rule({ cache: "contextual" })(async (parent, args, {req}, info) => {

    const { authorization } = req.headers;
    if (!authorization) {
      return false;
    }

    let token;
    
    if(authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }

    // if(!token){
    //     res.status(401).json({message: "Not authorized to access this route"});
    // }

    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);

        return !!userId;

        // if(!decoded){
        //     res.status(400).json({success: false, message: "Invaild token"})
        // }

        // const user = await User.findById(decoded.id);

        // if(!user){
        //     res.status(404).json({message: "User not found"});
        // }

    } catch (error) {
        console.log(error);
        return false;
    }
});

module.exports = isAuthorized;