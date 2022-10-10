import React, { Fragment, useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { SpeedDial,SpeedDialAction } from "@mui/lab";
import { Backdrop } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useDispatch,useSelector } from "react-redux";
import {logout} from '../../../actions/userAction'
const UserOption = ({ user}) => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const notyf = new Notyf({
    type: "success",
    position: { x: "right", y: "top" },
    ripple: true,
    dismissible: false,
    duration: 2000,
  });

  const {cartItems} = useSelector((state) => state.cart)
  const [open, setOpen] = useState(false);

  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "account", func: account },
    { icon: <ShoppingCartIcon style={{color:cartItems.length > 0 ? "tomato" : "unset" }} />, name: `Cart(${cartItems.length})`, func: cart },
    { icon: <ExitToAppIcon />, name: "logout", func: logoutUser },
  ];
  if (user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }
  function dashboard() {
    history("/admin/dashboard");
  }
  function orders() {
    history("/orders");
  }
  function account() {
    history("/account");
  }
  function cart() {
    history("/cart");
  }
  function logoutUser() {
    dispatch(logout());
    notyf.success("Logout Successfully");
  }
  return (
    <Fragment>
      <Backdrop 
       open={open}
       style={{zIndex: "10"}}
      />
      <SpeedDial
        ariaLabel="SpeedDial tooltrip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        style={{zIndex: "11"}}
        direction="down"
        className="speedDial"

        icon={
          <img
            className="speedDialIcon"
            src={user.avatar.url ? user.avatar.url : "/Profile.png"}
            alt="Profile"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOption;
