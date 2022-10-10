import React, { Fragment, useState, useEffect } from "react";
import "./UpdatePassword.css";
import { UPDATE_PASSWORD_RESET } from "../../constents/userConstents";
import Loader from "../layout/Loader/Loader";
import { useNavigate } from "react-router-dom";
import  LockOpenIcon from '@mui/icons-material/LockOpen'
import  LockIcon from '@mui/icons-material/Lock'
import  VpnKeyIcon from '@mui/icons-material/VpnKey'
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updatePassword} from "../../actions/userAction";
import MetaData from "../layout/MetaData";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const UpdatePassword = () => {
    const history = useNavigate();
  const dispatch = useDispatch();

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
  const { error, isUpdated, loading } = useSelector((state) => state.profile);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const  updatePasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);


    dispatch( updatePassword(myForm));
  };

  useEffect(() => {
    if (error) {
      notyf.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
        notyf1.success("Password Updated Successfully");
      history("/account");

      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [dispatch, error, history, isUpdated]);

  return (
    <Fragment>
    {loading ? (
      <Loader />
    ) : (
      <Fragment>
        <MetaData title="update Password" />
        <div className=" updatePasswordContainer">
          <div className=" updatePasswordBox">
            <h2 className=" updatePasswordHeading">Update Profile</h2>
            <form
              className=" updatePasswordForm"
              onSubmit={ updatePasswordSubmit}
            >
              
              <div className='loginPassword'>
                   <VpnKeyIcon />
                   <input type='password' 
                    placeholder='Old Password'
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                   />
                 </div>
              <div className='loginPassword'>
                   <LockOpenIcon />
                   <input type='password' 
                    placeholder='New Password'
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                   />
                 </div>
              <div className='loginPassword'>
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
                value="Change"
                className=" updatePasswordBtn"
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

export default UpdatePassword
