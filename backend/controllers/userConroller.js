const User = require("../models/user");
const ErorrHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAcyncError");
const sendToken = require("../utils/jwtToken");
const bcrypt = require('bcryptjs')
const sendEmail = require("../utils/sendEmails.js")
const crypto = require('crypto')
const cloudinary = require('cloudinary')

// Register a user

exports.registerUser = catchAsyncError(async (req, res, next) => {
 const mycloud= await cloudinary.v2.uploader.upload(req.body.avatar, {
   folder:"avatars",
   width: 150,
   crop: "scale"
 })
  const { name, email, password } = req.body;
  const excistEmail = await User.exists({email:email})
  if(excistEmail){
    return next(new ErorrHandler("Email Already Taken",401))
  }
  const user = await User.create({
    name,
    email,
    password,
    avatar:{
        public_id:mycloud.public_id,
        url:mycloud.secure_url
    }
  });

  sendToken(user,201,res)
});

//Login User
       
exports.loginUser = catchAsyncError(async (req,res,next)=>{
       
       const {email,password} =req.body
       
       //w checking if user given both
       if(!email || !password){
         return next(new ErorrHandler("Please Enter Email and Password",400))
       }

       const user = await User.findOne({email}).select("+password");

       if(!user){
        return next(new ErorrHandler("Invalid email or password",401))
       }
       
       const match = await bcrypt.compare(password,user.password)
      //  const isPasswordMatched = user.comparePassword(password);
       
       if(!match  ){
        return next(new ErorrHandler("Invalid email or password",401))
       }
      
   sendToken(user,200,res)

} )

//Logout User

exports.logout = catchAsyncError(async (req,res)=>{
    
  res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true
  })

  res.status(200).json({
    success:true,
    message:"Logged Out"
  })
}
)

// Forget Password

exports.forgotPassword = catchAsyncError(async (req,res,next)=>{
         const user = await User.findOne({email:req.body.email});
         if(!user){
          return next(new ErorrHandler("User not found",404));
         }

         // Get resetPassword Token
     const resetToken =   user.getResetPasswordToken();

     await user.save({validateBeforeSave:false});

     const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`
       
     const message  = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n if you have not requested this is email then please ignore it.`;

     try{

      await sendEmail({
        email:user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      })

      res.status(200).json({
        success:true,
        message:`Email sent to ${user.email} successfully`
      })

     }catch(error){
       user.resetPasswordToken = undefined;
       user.resetPasswordExpire = undefined;
       await user.save({validateBeforeSave:false});

       return next(new ErorrHandler(error.message,500));
     }


})
// reset password
exports.resetPassword = catchAsyncError(async (req,res,next) => {
   // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
    
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt: Date.now()}, 
    });

    if(!user){
      return next(new ErorrHandler("Reset password Token is Invalid or has been expired",404));
     }

     if(req.body.password !== req.body.confirmPassword){
      return next(new ErorrHandler("Password dose not matched",404))
     }

     user.password = req.body.password;
     user.resetPasswordToken = undefined;
     user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user,200,res)
})

// Get user Detail
exports.getUserDetails = catchAsyncError(async (req,res,next)=>{
         
   const  user = await User.findById(req.user.id);

   res.status(200).json({
    success:true,
    user,
   })
})

// Update user password

exports.updateUserPassword= catchAsyncError(async (req,res,next)=>{
         
  const  user = await User.findById(req.user.id).select("+password");
  const match = await bcrypt.compare(req.body.oldPassword,user.password)
  //  const isPasswordMatched = user.comparePassword(password);
   
   if(!match  ){
    return next(new ErorrHandler("old password is incorrect ",401))
   }
   if(req.body.newPassword !== req.body.confirmPassword){
    return next(new ErorrHandler("Password does not match ",401))
   }

   user.password = req.body.newPassword

   await user.save()
  sendToken(user,200,res)
})

// Update user Profile

exports.updateUserDetails= catchAsyncError(async (req,res,next)=>{
         
 const newUserData = {
  name: req.body.name,
  email: req.body.email,
 }
  
 if(req.body.avatar !== ""){
     const user = await User.findById(req.user.id);

     const imageId = user.avatar.public_id;
     
     await cloudinary.v2.uploader.destroy(imageId);
       
     const mycloud= await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder:"avatars",
      width: 150,
      crop: "scale"
    })
      
    newUserData.avatar = {
       public_id: mycloud.public_id,
       url: mycloud.secure_url
    }
 }


 const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
  new:true,
  runValidators:true,
  useFindAndModify:false,
 })
 res.status(200).json({
  success:true,
 })
})

// get  All users  (admin)
exports.getAllUsers= catchAsyncError(async (req,res,next)=>{
  const users = await User.find()
  res.status(200).json({
   success:true,
   users,
  })
})
// get  single user details (admin)
exports.getsingleUser= catchAsyncError(async (req,res,next)=>{
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErorrHandler(`User does not exsit with Id: ${req.params.id}`))
  }
  res.status(200).json({
   success:true,
   user,
  })
})
//Update user Role --Admin
exports.updateUserRole= catchAsyncError(async (req,res,next)=>{
         
  const newUserData = {
   name: req.body.name,
   email: req.body.email,
   role:req.body.role,
  }

  await User.findByIdAndUpdate(req.params.id,newUserData,{
   new:true,
   runValidators:true,
   useFindAndModify:false,
  })
  res.status(200).json({
   success:true,
  })
 })
//Delte user --Admin
exports.DeleteUser= catchAsyncError(async (req,res,next)=>{
    const user = await User.findById(req.params.id)

    if(!user){
      return next(new ErorrHandler(`user does not excist with id:${req.params.id}`,400))
    }

    const imageId = user.avatar.public_id;
     
    await cloudinary.v2.uploader.destroy(imageId);
    
    await user.remove();
  res.status(200).json({
   success:true,
   message:"User Deleted succesfully"
  })
 })