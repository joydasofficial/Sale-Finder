exports.getPrivateData = (req,res,next)=>{
    res.status(200).json({
        success: true,
        message: "You got the access to view this page",
    })
};