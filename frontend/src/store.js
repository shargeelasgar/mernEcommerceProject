import {configureStore} from '@reduxjs/toolkit'
import {newProductReducer, productReducer, productReviewsReducer, reviewReducer, singleProductReducer} from './reducers/productReducer'
import {productDetailsReducer} from './reducers/productReducer'
import {newReviewReducer} from './reducers/productReducer'
import {allUserReducer, userDetailsReducer, userReducer} from './reducers/userReducer'
import {profileReducer} from './reducers/userReducer'
import {forgotPasswordReducer} from './reducers/userReducer'
import {cartReducer} from './reducers/cartReducer'
import {allOrdersReducer, myOrdersReducer, newOrderReducer,orderDetailsReducer, orderReducer } from './reducers/orderReducer'
const store = configureStore({
   reducer:{
    products:productReducer,
    product:productDetailsReducer,
    user:userReducer,
    profile:profileReducer,
    forgotPassword:forgotPasswordReducer,
    cart:cartReducer,
    newOrder: newOrderReducer ,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
   newReview: newReviewReducer,
   newProduct: newProductReducer,
   singleProduct: singleProductReducer,
   allOrder: allOrdersReducer,
   order: orderReducer,
   allUsers:allUserReducer,
   userDetails: userDetailsReducer,
   productReview: productReviewsReducer,
   review: reviewReducer,
 }
 

})



// let initialState = {
//   cart: {
//     cartItems: localStorage.getItem("cartItems")
//       ? JSON.parse(localStorage.getItem("cartItems"))
//       : [],
//     shippingInfo: localStorage.getItem("shippingInfo")
//       ? JSON.parse(localStorage.getItem("shippingInfo"))
//       : {},
//   },
// };

export default store