import React, { Fragment, useState, useEffect } from "react";
import "./ResetPassword.css";
import Loader from "../layout/Loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import  LockOpenIcon from '@mui/icons-material/LockOpen'
import  LockIcon from '@mui/icons-material/Lock'
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, resetPassword} from "../../actions/userAction";
import MetaData from "../layout/MetaData";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const ResetPassword = () => {
    const history = useNavigate();
    const dispatch = useDispatch();
  
    const notyf = new Notyf({
      type: "error",
      position: { x: "right", y: "top" },
      ripple: true,
      dismissible: false,
      duration: 3000,
    });
    const notyf1 = new Notyf({
      type: "success",
      position: { x: "right", y: "top" },
      ripple: true,
      dismissible: false,
      duration: 3000,
    });
    const { error, success, loading } = useSelector((state) => state.forgotPassword);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    
    
    const {token} = useParams()
    const  resetPasswordSubmit = (e) => {
      e.preventDefault();
  
      const myForm = new FormData();
      myForm.set("password", password);
      myForm.set("confirmPassword", confirmPassword);
  
      dispatch(resetPassword(token,myForm));
    };
  
    useEffect(() => {
      if (error) {
        notyf.error(error);
        dispatch(clearErrors());
      }
      if (success) {
          notyf1.success("Password Updated Successfully");
        history("/login");
      }
    }, [dispatch, error, history, success]);
  

  return (
    <Fragment>
    {loading ? (
      <Loader />
    ) : (
      <Fragment>
        <MetaData title="reset Password" />
        <div className=" resetPasswordContainer">
          <div className=" resetPasswordBox">
            <h2 className=" resetPasswordHeading">Update Profile</h2>
            <form
              className=" resetPasswordForm"
              onSubmit={ resetPasswordSubmit}
            >
              
              <div>
                   <LockOpenIcon />
                   <input type='password' 
                    placeholder='New Password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                   />
                 </div>
              <div>
                   <LockIcon />
                   <input type='password' 
                    placeholder='Confirm Password'
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                   />
                 </div>

             
              <input
                type="submit"
                value="update"
                className=" resetPasswordBtn"
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

export default ResetPassword
