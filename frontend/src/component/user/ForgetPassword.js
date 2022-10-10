import React, { Fragment, useState, useEffect } from "react";
import "./ForgotPassword.css";
import Loader from "../layout/Loader/Loader";
import { useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, forgotPassword } from "../../actions/userAction";
import MetaData from "../layout/MetaData";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const ForgetPassword = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  
  const [email,setEmail] = useState("");

  const notyf = new Notyf({
    type: "success",
    position: { x: "right", y: "top" },
    ripple: true,
    dismissible: false,
    duration: 2000,
  });
  const notyf1 = new Notyf({
    type: "error",
    position: { x: "right", y: "top" },
    ripple: true,
    dismissible: false,
    duration: 2000,
  });
  const { error,message, loading } = useSelector((state) => state.forgotPassword);

  const forgetPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("email", email);
    dispatch(forgotPassword(myForm));
  };
     
  useEffect(() => {
    if (error) {
      notyf1.error(error);
      dispatch(clearErrors());
    }
    if (message) {
      notyf.success(message);
    }
  }, [dispatch,error,message]);
         
  return (
    <Fragment>
    {loading ? (
      <Loader />
    ) : (
      <Fragment>
        <MetaData title="Forget Password" />
        <div className="forgetPasswordContainer">
          <div className="forgetPasswordBox">
            <h2 className="forgetPasswordHeading">Forget Password</h2>
            <form
              className="forgetPasswordForm"
              onSubmit={forgetPasswordSubmit}
            >
              <div className="forgetPasswordEmail">
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <input
                type="submit"
                value="send"
                className="forgetPasswordBtn"
              />
              {/* disabled={loading ? true : false} */}
            </form>
          </div>
        </div>
      </Fragment>
    )}
  </Fragment>
  )
}

export default ForgetPassword
