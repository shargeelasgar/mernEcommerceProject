import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  updateProduct,
  getProductDetails,
} from "../../actions/productAction";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import StorageIcon from "@mui/icons-material/Storage";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Sidebar from "./Sidebar";
import { UPDATE_PRODUCT_RESET } from "../../constents/productConstents";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useParams,useNavigate} from "react-router-dom";

// const UpdateProduct = () => {
//     const notyf = new Notyf({
//         type: "error",
//         position: { x: "right", y: "top" },
//         ripple: true,
//         dismissible: false,
//         duration: 2000,
//       });
//   return (
//     <div>
      
//     </div>
//   )
// }
const UpdateProduct = () => {
    const notyf = new Notyf({
      type: "error",
      position: { x: "right", y: "top" },
      ripple: true,
      dismissible: false,
      duration: 2000,
    });
  
    const history = useNavigate();
    const dispatch = useDispatch();
    const { loading, error: updateError, isUpdated } = useSelector((state) => state.singleProduct);
    const {product, error} = useSelector((state) => state.product)
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [oldImages,setOldImages] = useState([]);
    const categories = [
      "Laptop",
      "Footwear",
      "Bottom",
      "Tops",
      "Attire",
      "camera",
      "SmartPhones",
    ];
    const {id} = useParams() 
    const updateProductSubmitHandler = (e) => {
      e.preventDefault();
  
       const myForm = new FormData();
  
       myForm.set("name", name);
       myForm.set("price", price);
       myForm.set("Stock", stock );
       myForm.set("description", description );
       myForm.set("category", category );
  
       images.forEach((image) => {
          myForm.append("images",image)
       })
       dispatch(updateProduct(id,myForm))
      }
     
    const updateProductImagesChange = (e)  => {
      const files = Array.from(e.target.files)
  
      setImages([]);
      setImagesPreview([]);
      setOldImages([]);
  
      files.forEach((file) => {
          const reader = new  FileReader();
       
           reader.onload = () => {
              if(reader.readyState === 2){
                  setImagesPreview((old) => [...old, reader.result])
                  setImages((old) => [...old, reader.result])
              }
           }
  
          reader.readAsDataURL(file)
      })
    }
  
    useEffect(() => {
      
        if(product && product._id !== id){
           dispatch(getProductDetails(id))
        }else{
            setName(product.name)
            setDescription(product.description)
            setPrice(product.price)
            setCategory(product.category)
            setStock(product.Stock)
            setOldImages(product.images)
        }

      if (error) {
        notyf.error(error);
        dispatch(clearErrors());
      }

      if (updateError) {
        notyf.error(updateError);
        dispatch(clearErrors());
      }
      if (isUpdated) {
        notyf.success("Product Updated Successfully");
        history("/admin/products");
        dispatch({ type:UPDATE_PRODUCT_RESET });
      }
    }, [dispatch, error, history, isUpdated,id,product,updateError]);
       
    return (
      <Fragment>
        <MetaData titel="Create Products" />
        <div className="dashboard">
          <Sidebar />
          <div className="newProductContainer">
            <form className="createProductForm" oncType="multipart/form-data" onSubmit={updateProductSubmitHandler}>
              <div>
                <SpellcheckIcon />
                <input
                  type="text"
                  placeholder="Product Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <AttachMoneyIcon />
                <input
                  type="number"
                  placeholder="Price"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <DescriptionIcon />
                <textarea
                  placeholder="Product Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  cols="10"
                  rows="1"
                ></textarea>
              </div>
              <div>
                <AccountTreeIcon />
                <select  onChange={(e) => setCategory(e.target.value)} value={category}>
                  <option value="">Choose Category</option>
                  {categories.map((cate) => (
                    <option key={cate} value={cate}>
                      {cate}
                    </option>
                  ))}
                </select>
              </div>
  
              <div>
                <StorageIcon />
                <input
                  type="number"
                  placeholder="Stock"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
  
              <div id="createProductFormFile">
                <input type="file" name="avatar" accept="image/" multiple  onChange={updateProductImagesChange}/>
              </div>
  
              <div id="createProductFormImage">
                {oldImages &&  
                    oldImages.map((image, index) => (
                  <img key={index} src={image.url} alt="old ProductPreview" />
                ))}
              </div>
              <div id="createProductFormImage">
                {imagesPreview.map((image, index) => (
                  <img key={index} src={image} alt="Product Preview" />
                ))}
              </div>
  
              <Button
                id="createProductBtn"
                type="submit"
                disabled={loading ? true : false}
              >
                Update
              </Button>
            </form>
          </div>
        </div>
      </Fragment>
    );
  };
  

export default UpdateProduct
