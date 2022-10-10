const app = require('./app')

const cloudinary = require('cloudinary')
const connectDatabase = require('./config/database')

// Handle uncaught Expception

process.on("uncaughtException", (err)=>{
 console.log(`Error: ${err.message}`);
 console.log(`shutting down the server due to uncaughtException Promise Rejection`);
  process.exit(1);
 
})


// config
if(process.env.NODE_ENV!=="PRODUCTION"){
 require("dotenv").config({path: "backend/config/.env"})
}

// Connecting data base
connectDatabase()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
}) 

const server = app.listen(process.env.PORT, () => {
    console.log(`server is working  on http://localhost:${process.env.PORT}`);
}) 


// unhandled Promis Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to unhandled Promise Rejection`);

 server.close(()=>{
    process.exit(1);
 })
})
