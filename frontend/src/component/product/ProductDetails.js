import React, { Fragment, useEffect, useState } from 'react'
import Carousel from 'react-material-ui-carousel'
import "./ProductDetails.css"
import {useDispatch,useSelector} from 'react-redux'
import {clearErrors, getProductDetails, newReview} from '../../actions/productAction'
import { useParams } from 'react-router-dom'
import ReviewCard from './ReviewCard.js'
import Loader from '../layout/Loader/Loader'
import {Notyf} from 'notyf'
import 'notyf/notyf.min.css';
import MetaData from "../layout/MetaData";
import {addItemsToCart} from '../../actions/cartAction'
import { Dialog,DialogActions,DialogContent,DialogTitle,Button } from '@mui/material'
import {Rating} from '@mui/material'
import { NEW_REVIEW_RESET } from '../../constents/productConstents'

const ProductDetails = () => {
  const notyf1 = new Notyf({
    type: 'error',
    position: {x:'right',y:'top'},
    ripple:true,
    dismissible: false,
    duration: 2000,
})
  const notyf = new Notyf({
    type: 'success',
    position: {x:'right',y:'top'},
    ripple:true,
    dismissible: false,
    duration: 2000,
})
  const dispatch = useDispatch()
  const {product,loading,error} = useSelector((state) => state.product)
  const {success, error: reviewError} = useSelector((state) => state.newReview)
  const {id} = useParams()
  
    const options = {
      value:product.ratings,
      readOnly:true,
      precision:0.5
    }


    
    const [quantity, setQuantity] = useState(1)
    const [open,setOpen] = useState(false)
    const [rating,setRating] = useState(0)
    const[comment,setComment] = useState("")
    
    
    const increasequantity = () => {
      if(product.Stock <= quantity)  return;
      
      const qty = quantity + 1
      setQuantity(qty)
      
  }
  const decreasequantity = () => {
    if(1 >=  quantity)  return;
    
    const qty = quantity - 1
    setQuantity(qty)
  }
  
  
  const addToCartHandler = () => {
    dispatch(addItemsToCart(id,quantity))   
    notyf.success("Item Added To Cart")
  }
  
  const submitReviewToggel = () => {
       open ? setOpen(false) : setOpen(true)
    }

  const revieSubmitHandler = () => {

     const myForm = new FormData();

     myForm.set("rating", rating);
     myForm.set("comment", comment);
     myForm.set("productId", id)
      
     dispatch(newReview(myForm))

     setOpen(false)
  }

    useEffect(() => {
      if(error){
        notyf1.error(error) 
        dispatch(clearErrors())
      }
      if(reviewError){
        notyf1.error(reviewError) 
        dispatch(clearErrors())
      }
      if(success){
        notyf.success("Review Submitted Successfully")
        dispatch({type: NEW_REVIEW_RESET})
      }
      dispatch(getProductDetails(id))  
    },[dispatch,id,error, success,reviewError])


  return (
    <Fragment>
      {loading ? <Loader/> : ( 
      <Fragment>
      <MetaData title={`${product.name} -- ECOMMERCE`} />
    <div className='ProductDetails'> 
    <div className='div-1'>
     <Carousel>      
       {product.images && product.images.map((item,i) => (
         <img
          className='CarouselImage'
          key={item.url}
          src={item.url}
          alt={`${i} Slide`}
         />
       ))}
     </Carousel>
     </div>
     <div >
       <div className='detailsBlock-1'>
        <h2>{product.name}</h2>
        <p>Product # {product._id}</p>
       </div>
       <div className='detailsBlock-2'>
         <Rating {...options}/>
         <span className='detailsBlock-2-span'>({product.numOfReviews} Review)</span>
       </div>
       <div className='detailsBlock-3'>
        <h1>{`Rs.${product.price}`}</h1>
        <div className='detailsBlock-3-1'>
          <div className='detailsBlock-3-1-1'>
          <button onClick={decreasequantity}>-</button>
          <input readOnly type="number"  value={quantity} />
          <button onClick={increasequantity}>+</button>
          </div>
          <button disabled={product.Stock < 1 ? true : false }  onClick={addToCartHandler}>Add to cart</button>
        </div>
        <p>
          <b className={product.Stock < 1 ? 'redColor' : 'greenColor'}>
            {product.Stock < 1 ? 'OutofStock' : "InStock"}
          </b>
        </p>
       </div>
       <div className='detailsBlock-4'>
        Description : <p>{product.description}</p>
       </div>
       <button onClick={submitReviewToggel}  className='submitReview'>submitReview</button>
     </div>
    </div>
    <h3 className='reviewsHeading'>REVIEWS</h3>
       <Dialog
            aria-labelledby='simple-dialog-title'
            open={open}
            onClose={submitReviewToggel}
       >
        <DialogTitle>Submit Review</DialogTitle>
        <DialogContent className='submitDialog'>
             <Rating
             onChange={(e) => setRating(e.target.value)}
             value={rating}
             size="large"
             />
             <textarea
             className='submitDialogTextArea'
             cols="30"
             rows="5"
             value={comment}
             onChange={(e) => setComment(e.target.value)}
             >
             </textarea>
        </DialogContent>
        <DialogActions>
          <Button onClick={submitReviewToggel} color='secondary'>Cancel</Button>
          <Button onClick={revieSubmitHandler} color='primary'>Submit</Button>
        </DialogActions>


       </Dialog>

    {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className='noReviews'>No Reviews Yet</p>
          )}

    </Fragment>) }
  
    </Fragment>
  );
};

export default ProductDetails
