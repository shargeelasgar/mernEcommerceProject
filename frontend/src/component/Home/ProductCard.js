import React from 'react'
import { Link } from 'react-router-dom'
import { Rating } from '@mui/material'
import "./Home.css"



const ProductCard = ({product}) => {
  const options = {
    value: product.ratings,
    readOnly:true,
    precision:0.5
  }
  return (
    <Link className="productCard" to={`/product/${product._id}`}>
       {/* <img src="https://i.ibb.co/TtKj5fd/1phone.jpg" alt="1phone" border="0" /> */}
    <img src={product.images[0].url} alt={product.name} />
    <p>{product.name}</p>
    <div>
      <Rating {...options} />
      <span className="productCardSpan">
        ({product.numOfReviews} Reviews)
      </span>
    </div>
    <span>{`Rs.${product.price}`}</span>
   
  </Link>
  )
}

export default ProductCard
