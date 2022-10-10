import React, { Fragment, useEffect, useState } from "react";
import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Sidebar from "./Sidebar";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useNavigate, useParams } from "react-router-dom";
import { UPDATE_USER_RESET } from "../../constents/userConstents";
import { getUserDetails, updateUser, clearErrors } from "../../actions/userAction";
import Loader from "../layout/Loader/Loader";
const UpdateUser = () => {
  const notyf = new Notyf({
    type: "error",
    position: { x: "right", y: "top" },
    ripple: true,
    dismissible: false,
    duration: 2000,
  });
  const history = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, user } = useSelector((state) => state.userDetails);
     console.log(user);
  const {
    loading: updateLoading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const {id} = useParams()

  useEffect(() => {
    if (user && user._id !== id) {
      dispatch(getUserDetails(id));
    } else {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
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
      notyf.success("User Updated Successfully");
      history("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [dispatch,  error, history, isUpdated, updateError, user, id]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    dispatch(updateUser(id, myForm));
  };
  // const { loading, error, user} = useSelector((state) => state.userDetails);
  // const { loading: updateLoading, error:updatedError, isUpdated } = useSelector((state) => state.profile);
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [role, setRole] = useState("");
  // const {id} = useParams()
  

  
  
  // useEffect(() => {
  //   if(user && user._id !== id){
  //     dispatch(getUserDetails(id))
  //  }else{
  //      setName(user.name)
  //      setEmail(user.email)
  //      setRole(user.role)
  //  }
  //   if (error) {
  //     notyf.error(error);
  //     dispatch(clearErrors());
  //   }
  //   if (updatedError) {
  //     notyf.error(updatedError);
  //     dispatch(clearErrors());
  //   }
  //   if (isUpdated) {
  //     notyf.success("User Updated Successfully");
  //     history("/admin/users");
  //     dispatch({ type: UPDATE_USER_RESET});
  //   }
  // }, [dispatch, error, history, isUpdated,updatedError,user,id]);
  
  // const updateUserSubmitHandler = (e) => {
  //   e.preventDefault();

  //    const myForm = new FormData();

  //    myForm.set("name", name);
  //    myForm.set("email", email);
  //    myForm.set("role", role);

  //    dispatch(updateUser(id,myForm))
  //   }

  return (
    <Fragment>
      <MetaData titel="Update User" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
         {loading ? (<Loader/>) : (
           <form className="createProductForm"  onSubmit={updateUserSubmitHandler}>
           <h1>Update User</h1>
           <div>
                <PersonIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <VerifiedUserIcon />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

           <Button
             id="createProductBtn"
             type="submit"
             disabled={updateLoading ? true : false || role===""? true : false}
           >
             Update
           </Button>
         </form>
         )}
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser
