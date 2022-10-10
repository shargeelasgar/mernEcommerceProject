import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import "../cart/ConfirmOrder.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import Sidebar from "./Sidebar";
import { getOrderDetails, clearErrors, updateOrder } from "../../actions/orderAction";
import { Notyf } from "notyf";
import Loader from "../layout/Loader/Loader";

import "notyf/notyf.min.css";
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import { Button } from "@mui/material";
import { UPDATE_ORDERS_RESET } from "../../constents/orderConstents";
import './UpdateOrder.css'
const UpdateOrder = () => {
  const notyf = new Notyf({
    type: "error",
    position: { x: "right", y: "top" },
    ripple: true,
    dismissible: false,
    duration: 2000,
  });
  const { id } = useParams();
  const history = useNavigate();
  const dispatch = useDispatch();
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const {  error : updateError , isUpdated} = useSelector((state) => state.order);
  const [status,setStatus] = useState("")
  const processOrder = (e) => {
    e.preventDefault();
  
    const myForm = new FormData();

    myForm.set("status", status);
   
    dispatch(updateOrder(id,myForm))

  };
  useEffect(() => {
    if (error) {
      notyf.error(error);
      dispatch(clearErrors);
    }
    if (updateError) {
      notyf.error(error);
      dispatch(clearErrors);
    }
    if (isUpdated) {
      notyf.success("Order updated successfully");
      dispatch({type: UPDATE_ORDERS_RESET});
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, error, id,isUpdated,updateError]);

  return (
    <Fragment>
      <MetaData titel="Update Orders" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          {loading ? (
            <Loader />
          ) : (
            <div className="confirmOrderPage"
            style={{
                display: order.orderStatus === "Delivered" ? "block" : "grid"
            }}
            >
              <div>
                <div className="confirmshippingArea">
                  <Typography>Shipping Info</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p>Name:</p>
                      <span>{order.user && order.user.name}</span>
                    </div>
                    <div>
                      <p>Phone:</p>
                      <span>
                        {order.shippingInfo && order.shippingInfo.phone}
                      </span>
                    </div>
                    <div>
                      <p>Address:</p>
                      <span>
                        {order.shippingInfo &&
                          `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                      </span>
                    </div>
                  </div>
                  <Typography>Payment</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          order.paymentInfo &&
                          order.paymentInfo.status === "succeeded"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {order.paymentInfo &&
                        order.paymentInfo.status === "succeeded"
                          ? "PAID"
                          : "NOT PAID"}
                      </p>
                    </div>
                    <div>
                      <p>Amount:</p>
                      <span>{order.totalPrice && order.totalPrice}</span>
                    </div>
                  </div>
                  <Typography>Order Status</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          order.orderStatus && order.orderStatus === "Delivered"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {order.orderStatus && order.orderStatus}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="confirmCartItems">
                  <Typography>Your Cart Items:</Typography>
                  <div className="confirmCartItemsContainer">
                    {order.orderItems &&
                      order.orderItems.map((item) => (
                        <div key={item.product}>
                          <img src={item.image} alt="Product" />
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                          <span>
                            {item.quantity} X Rs.{item.price} =
                            <b>Rs.{item.price * item.quantity}</b>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div style={{
                display: order.orderStatus === "Delivered" ? "none" : "block"
              }}>
                <form
                  className="updateOrderForm"
                  oncType="multipart/form-data"
                  onSubmit={processOrder}
                >
                    <h1>Process Order</h1>
                  <div>
                    <AccountTreeIcon />
                    <select
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">Choose Category</option>
                       {order.orderStatus === "Processing" && <option value="Shipped">Shipped</option>}
                       {order.orderStatus === "Shipped"  &&  <option value="Delivered">Delivered</option>}
                    </select>
                  </div>

                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={loading ? true : false || status===""?true:false}
                  >
                    Process
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateOrder;
