const express = require('express')
const app = express();
const cookiePareser= require('cookie-parser')
const bodyParser = require('body-parser')
const fileupload = require('express-fileupload')
const errorMiddleware = require('./middlewares/Error');
const path = require('path')

// config
if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({path: "backend/config/.env"})
   }
   


app.use(express.json())
app.use(cookiePareser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileupload())

app.use(express.static(path.join(__dirname,"../frontend/build")))
app.get("*",(req,res) => {
    res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"))
})
// Route Imports
const product = require("./routes/productRoute")
const user = require("./routes/userRoute")
const order = require('./routes/orderRoute')
const payment = require('./routes/paymentRoute')
app.use("/api/v1",product)
app.use('/api/v1', user)
app.use('/api/v1', order)
app.use('/api/v1', payment)

// Middlewares for error

app.use(errorMiddleware)

module.exports = app