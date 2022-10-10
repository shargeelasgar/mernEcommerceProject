import React, { Fragment } from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Typography } from "@mui/material";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import "./payment.css";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EventIcon from "@mui/icons-material/Event";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {createOrder,clearErrors} from '../../actions/orderAction'


const Payment = () => {
    const notyf = new Notyf({
      type: "error",
      position: { x: "right", y: "top" },
      ripple: true,
      dismissible: false,
      duration: 2000,
    });
    const history = useNavigate()
    const dispatch = useDispatch()
    const stripe = useStripe()
    const elements = useElements()
    const {shippingInfo, cartItems} = useSelector((state) => state.cart)
    const {user} = useSelector((state) => state.user)
    const {error} = useSelector((state) => state.newOrder)
          
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo")) 
    const payBtn = useRef(null);

     const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100)
     } 

     const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
      };

     const submitHandler = async (e) => {
        e.preventDefault();
    
        payBtn.current.disabled = true;
    
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
          const { data } = await axios.post(
            "/api/v1/payment/process",
            paymentData,
            config
          );
    
          const client_secret = data.client_secret;
    
          if (!stripe || !elements) return;
    
          const result = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
              card: elements.getElement(CardNumberElement),
              billing_details: {
                name: user.name,
                email: user.email,
                address: {
                  line1: shippingInfo.address,
                  city: shippingInfo.city,
                  state: shippingInfo.state,
                  postal_code: shippingInfo.pinCode,
                  country: shippingInfo.country,
                },
              },
            },
          });
    
          if (result.error) {
            payBtn.current.disabled = false;
    
            alert.error(result.error.message);
          } else {
            if (result.paymentIntent.status === "succeeded") {

                order.paymentInfo={
                   id: result.paymentIntent.id,
                   status:result.paymentIntent.status
                }
                dispatch(createOrder(order))
              history("/success");
            } else {
              notyf.error("There's some issue while processing payment ");
            }
          }
        } catch (error) {
          payBtn.current.disabled = false;
          notyf.error(error);
        }
      };
     useEffect(() => {
         if(error){
            notyf.error(error);
            dispatch(clearErrors())
         }

     },[dispatch,error])

  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <form onSubmit={(e) => submitHandler(e)} className='paymentForm'>
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>
          <input
            type="submit"
            value={`Pay - Rs.${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;
