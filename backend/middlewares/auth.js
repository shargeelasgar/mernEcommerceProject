const User = require("../models/user");
const ErorrHandler = require("../utils/errorHandler");
const catchAcyncError = require("./catchAcyncError");
const jwt = require('jsonwebtoken')

exports.isAuthenticated = catchAcyncError(async(req,res,next)=>{
    
   const {token} = req.cookies;
   if(!token){
      return next(new ErorrHandler("Please Login to access this resources",401))
   }
      
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

   req.user = await User.findById(decodedData.id);
     
   next();
})

exports.authrizeRoles = (...roles) =>{
   return (req,res,next)=>{
      if(!roles.includes(req.user.role)){
      return next(new ErorrHandler(`Role: ${req.user.role} is not allowed to access this resource`,403))       
      }
      next();
   }
}
