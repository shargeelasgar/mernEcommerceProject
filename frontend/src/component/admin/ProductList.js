import React, { Fragment, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getAdminProduct, deleteProduct } from "../../actions/productAction";
import { Link, useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar";
import { DELETE_PRODUCT_RESET } from "../../constents/productConstents";

const ProductList = () => {
  const notyf = new Notyf({
    type: "error",
    position: { x: "right", y: "top" },
    ripple: true,
    dismissible: false,
    duration: 2000,
  });
  const notyf1 = new Notyf({
    type: "success",
    position: { x: "right", y: "top" },
    ripple: true,
    dismissible: false,
    duration: 2000,
  });
  
  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id))
  }
  const history = useNavigate();
  const dispatch = useDispatch();
  const { error, products } = useSelector((state) => state.products);
  const {error : deleteError, isDeleted} = useSelector((state) => state.singleProduct)

   useEffect(() => {
     if(error){
        notyf.error(error)
        dispatch(clearErrors())
     }   
     if(deleteError){
        notyf.error(deleteError)
        dispatch(clearErrors())
     }   
     if(isDeleted){
      notyf1.success("Product Deleted Successfully");
      history("/admin/dashboard")
      dispatch({type: DELETE_PRODUCT_RESET })
     }
      dispatch(getAdminProduct())
   },[dispatch,error, deleteError,isDeleted,history])
   
  const columns = [
    { field: "id",headerName: "Product ID", minWidth: 200, flex: 0.5 },
    { field: "name", headerName: "Name", minWidth: 350, flex: 1 },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button onClick={() => deleteProductHandler(params.getValue(params.id, "id"))}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  products &&
    products.forEach((item) => {
      rows.push({
        id: item._id,
        stock: item.Stock,
        price: item.price,
        name: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`All PODUCTS - Admin`} />

      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL products</h1>
          <DataGrid rows={rows} 
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          className="productListTable"
          autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
};

export default ProductList;
