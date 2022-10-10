import React, {Fragment, useEffect} from 'react'
import { BsMouse } from 'react-icons/bs'
import "./Home.css"
import Product from './ProductCard'
import MetaData  from '../layout/MetaData'
import {clearErrors, getProduct} from '../../actions/productAction'
import {useDispatch,useSelector} from 'react-redux'
import Loader from '../layout/Loader/Loader'
// import Message from "alert-message"
// import {useAlert} from 'react-alert'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import alert from 'alert'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css';


const Home = () => {
 const notyf = new Notyf({
    type: 'error',
    position: {x:'right',y:'top'},
    ripple:true,
    dismissible: false,
    duration: 2000,
})



  const dispatch = useDispatch()
  const {loading,error,products}= useSelector(state=> state.products)

  useEffect(() => {
    if(error){
      notyf.error(error) 
      dispatch(clearErrors())
    }
    dispatch(getProduct());
  },[dispatch,error])
  return (
   <Fragment>
    {loading ? (<Loader/>) : (
      <Fragment>
      <MetaData title="GAREEB BANDA"/>
      <div className='banner'>
          <p>Welcome to ecommerce</p>
          <h1>FIND AMAZING PRODUCTS BELOW</h1>
          <a href='#container'><button className='btn'> Scroll <BsMouse /> </button ></a>  
      </div>
      <h2 className='homeHeading'>Featured Products</h2>
  
      <div className='container' id='container'>
       {products && products.map(product =>  (
         <Product key={product._id} product={product} />
       ))} 
      </div>
     </Fragment>
    ) }
   </Fragment>
  )
}

export default Home;

// <Fragment>
//     <MetaData title="GAREEB BANDA"/>
//     <div className='banner'>
//         <p>Welcome to ecommerce</p>
//         <h1>FIND AMAZING PRODUCTS BELOW</h1>
//         <a href='#container'><button className='btn'> Scroll <BsMouse /> </button ></a>  
//     </div>
//     <h2 className='homeHeading'>Featured Products</h2>

//     <div className='container' id='container'>
//      {products && products.map(product => (
//        <Product product={product} />
//      ))}
//     </div>
//    </Fragment>