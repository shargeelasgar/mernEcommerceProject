import './App.css';
import Header from './component/layout/Header/Header.js'
import Footer from'./component/layout/Footer/Footer.js'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import webFont from 'webfontloader'
import React, { useState, useEffect } from 'react'
import Home from './component/Home/Home.js'
import ProductDetails from './component/product/ProductDetails.js'
import Products from './component/product/Products.js'
import Search from './component/product/Search.js'
import LoginSignUp from './component/user/LoginSignUp.js'
import store from './store'
import { loadUser } from './actions/userAction';
import UserOption  from './component/layout/Header/UserOption.js'
import { useSelector } from 'react-redux';
import Profile from './component/user/Profile.js'
import ProductedRoute from './component/Route/ProductedRoute'
import AdminProductedRoute from './component/Route/AdminProductedRoute.js'
import UpdateProfile from './component/user/UpdateProfile.js'
import UpdatePassword from './component/user/UpdatePassword.js'
import ForgetPassword from './component/user/ForgetPassword.js'
import ResetPassword from './component/user/ResetPassword.js'
import Cart from './component/cart/Cart.js'
import Shipping from './component/cart/Shipping.js'
import ConfirmOrder from './component/cart/ConfirmOrder.js'
import axios from 'axios';
import Payment from './component/cart/Payment.js'
import {Elements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import OrderSuccess from './component/cart/OrderSuccess.js'
import MyOrders from './component/Order/MyOrders.js'
import OrderDetails from './component/Order/OrderDetails.js'
import DashBoard from './component/admin/DashBoard.js'
import ProductList from './component/admin/ProductList.js'
import NewProduct from './component/admin/NewProduct';
import UpdateProduct from './component/admin/UpdateProduct.js';
import OrderList from './component/admin/OrderList.js';
import UpdateOrder from './component/admin/UpdateOrder.js';
import UserList from './component/admin/UserList.js';
import UpdateUser from './component/admin/UpdateUser.js';
import ProductReviews from './component/admin/ProductReviews.js';
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";
import NotFound from "./component/layout/Not Found/NotFound.js";
function App() {

const {isAuthenticated, user,} = useSelector((state) => state.user)
const [stripeApiKey,setStripeApiKey] = useState("");

async function getStripeApiKey() {
  const {data} = await axios.get("/api/v1/stripeapiKey");

  setStripeApiKey(data.stripeApikey);
}

  useEffect(() => {
    webFont.load({
      google:{
        families:["Roboto","Droid","chilanka"]
      }
    }) 
    store.dispatch(loadUser())
    getStripeApiKey()
  }, [])

    // window.addEventListener("contextmenu",(e) => e.preventDefault());   

  return (
    <Router>
    <Header />
      {isAuthenticated && <UserOption user={user} />}
    <Routes>
    <Route exact path='/' element={<Home/>}></Route>
    <Route exact path='/contact' element={<Contact/>}></Route>
    <Route exact path='/about' element={<About/>}></Route>
    <Route exact path='/product/:id' element={<ProductDetails/>}></Route>
    <Route exact path='/products' element={<Products/>}></Route>
    <Route  path='/products/:Keyword' element={<Products/>}></Route>
    <Route exact path='/search' element={<Search/>}></Route>
    <Route exact path='/login' element={<LoginSignUp/>}></Route>
    <Route exact path='/account' element={<ProductedRoute element={Profile} />}> </Route>
    <Route exact path='/me/update' element={<ProductedRoute element={UpdateProfile} />}> </Route>
    <Route exact path='/password/update' element={<ProductedRoute element={UpdatePassword} />}> </Route>
    <Route exact path='/password/forget' element={<ForgetPassword />}> </Route>
    <Route exact path="/password/reset/:token" element={<ResetPassword />}> </Route>
    <Route exact path="/cart" element={<Cart />}> </Route>
    <Route exact path='/shipping' element={<ProductedRoute element={Shipping} />}> </Route>
    <Route exact path='/order/confirm' element={<ProductedRoute element={ConfirmOrder} />}> </Route>
    <Route exact path='/process/payment' element={stripeApiKey && (<Elements stripe={loadStripe(stripeApiKey)}><ProductedRoute element={Payment} /></Elements>) }> </Route>
    <Route exact path='/success' element={<ProductedRoute element={OrderSuccess} />}> </Route>
    <Route exact path='/orders' element={<ProductedRoute element={MyOrders} />}> </Route>
    <Route exact path='/order/:id' element={<ProductedRoute element={OrderDetails} />}> </Route>
    <Route exact path='/admin/dashboard' element={<AdminProductedRoute element={DashBoard} />}> </Route>
    <Route exact path='/admin/products' element={<AdminProductedRoute element={ProductList} />}> </Route>
    <Route exact path='/admin/product' element={<AdminProductedRoute element={NewProduct} />}> </Route>
    <Route exact path='/admin/product/:id' element={<AdminProductedRoute element={UpdateProduct} />}> </Route>
    <Route exact path='/admin/orders' element={<AdminProductedRoute element={OrderList} />}> </Route>
    <Route exact path='/admin/order/:id' element={<AdminProductedRoute element={UpdateOrder} />}> </Route>
    <Route exact path='/admin/users' element={<AdminProductedRoute element={UserList} />}></Route>
    <Route exact path='/admin/user/:id' element={<AdminProductedRoute element={UpdateUser} />}></Route>
    <Route exact path='/admin/reviews' element={<AdminProductedRoute element={ProductReviews} />}></Route>
    <Route path='*' element={ window.location.pathname === "/process/payment" ? null : <NotFound/>}></Route>
    {/* <Route exact path='/admin/dashboard' element={!loading && isAuthenticated  && user.role === "admin" ? <DashBoard /> : <Navigate to="login" />}> </Route> */}

    {/* <AdminProductedRoute isAdmin={true}  element={DashBoard} /> */}
   

    </Routes>
    <Footer />
  </Router>
  );
}

export default App;

