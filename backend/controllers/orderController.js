const Order = require("../models/order");
const Product = require("../models/product");
const ErorrHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAcyncError");

// Create New Order

exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shipingPrice,
    totalPrice
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shipingPrice,
    totalPrice,
    paidAt:Date.now(),
    user:req.user._id
   })
   res.status(201).json({
    success: true,
    order
   })
});

// get single order
exports.getsingleOrder = catchAsyncError(async (req, res, next) => {
  
    const order = await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return next(new ErorrHandler("Order not found with this Id", 404 ))
    }

    res.status(200).json({
        success:true,
        order
    })
})
// get Logged in user Orders
exports.myOrders= catchAsyncError(async (req, res, next) => {
  
    const orders = await Order.find({ user: req.user._id })

   

    res.status(200).json({
        success:true,
        orders
    })
})
// get all users Orders for (admin)
exports.getAllOrders= catchAsyncError(async (req, res, next) => {
    const orders = await Order.find()

    let totalAmount=0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    });

    res.status(200).json({
        success:true,
        orders,
        totalAmount
    });
});
// update user Order status (admin)
exports.updateOrderStatus= catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErorrHandler("Order not found with this Id", 404 ))
    }
if(order.orderStatus === "Delivered"){
    return next(new ErorrHandler("You have already delivered this order",404))
}

  if(req.body.status === "Shipped"){
    order.orderItems.forEach(async (order)=>{
        await updateStock(order.
            product,order.quantity);
      });
  }

  order.orderStatus = req.body.status;

  if(req.body.status === "Delivered"){
    order.deliveredAt = Date.now()
  }
  await order.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
       
    });
});

async function updateStock (id, quantity){
const product  = await Product.findById(id)
 product.Stock -= quantity
 await product.save({ validateBeforeSave: false })
}
// delete Order -- admin
exports.deleteOrders= catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErorrHandler("Order not found with this Id", 404 ))
    }
    await order.remove()
    res.status(200).json({
        success:true,
    });
});