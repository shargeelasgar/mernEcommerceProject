const ErrorHandler = require("../utils/errorHandler")

module.exports = (err,req,res,next) =>{
    err.statusCode =   err.statusCode || 500;
    err.message = err.message || "Internal server error";


    // wrong Mongodb id error
    if(err.name === "CastError"){
        const message = `Resources not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400)
    }
    
    //   excist email
    //   if(err.code === 11000){
    //     const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    //   }
     // wrong webToken
    if(err.name === "JsonWebTokenError"){
        const message = `Json web Token is invalid, try again`;
        err = new ErrorHandler(message,400)
    }
    // JWT EXPIRE TOken
    if(err.name === "TokenExpiredError"){
        const message = `Json web Token is Expired, try again`;
        err = new ErrorHandler(message,400)
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}
