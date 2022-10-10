import React, { Fragment, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar";
import { deleteOrder, getAllOrders, clearErrors } from "../../actions/orderAction";
import { DELETE_ORDERS_RESET } from "../../constents/orderConstents";

const OrderList  = () => {
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
  
  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id)) 
  }
  const history = useNavigate();
  const dispatch = useDispatch();
  const { error, orders } = useSelector((state) => state.allOrder);
  const {error : deleteError, isDeleted} = useSelector((state) => state.order)

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
      notyf1.success("Order Deleted Successfully");
      history("/admin/orders")
      dispatch({type: DELETE_ORDERS_RESET })
     }
      dispatch(getAllOrders())
   },[dispatch,error, deleteError,isDeleted,history])
   
  const columns = [
    {field: "id", headerName: "Order ID", minWidth: 230,flex:0.6},

        {
            field:"status",
            headerName: "Status",
            minWidth: 180,
            flex:0.4,
            cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Delivered" ? "greenColor" : "redColor"
            }
        },
        {
            field:"itemQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 200,
            flex: 0.4

        },
        {
            field:"amount",
            headerName: "Amount",
            type: "number",
            minWidth: 200,
            flex:0.5

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
            <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button onClick={() => deleteOrderHandler(params.getValue(params.id, "id"))}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <Fragment>
      <MetaData title={`All Orders - Admin`} />

      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL Orders</h1>
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

export default OrderList ;
