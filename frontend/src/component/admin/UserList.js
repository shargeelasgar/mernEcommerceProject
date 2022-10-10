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
import { DELETE_USER_RESET } from "../../constents/userConstents";
import { getAllUsers,clearErrors, deleteUser} from "../../actions/userAction";

const UserList = () => {
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
  
  const history = useNavigate();
  const dispatch = useDispatch();
  const { error, users} = useSelector((state) => state.allUsers);
  const {error: deleteError,isDeleted,message} = useSelector((state) => state.profile)
  
  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id))
  }
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
      notyf1.success(message);
      history("/admin/users")
      dispatch({type: DELETE_USER_RESET })
     }
      dispatch(getAllUsers())
   },[dispatch,error, deleteError,isDeleted,history,message])
   
  const columns = [
    { field: "id", headerName: "User ID  ", minWidth: 180, flex: 0.5 },
    { field: "email", headerName: "Email", minWidth: 200, flex: 0.5 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.4,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin" ? "greenColor" : "redColor"
    }
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
            <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button onClick={() => deleteUserHandler(params.getValue(params.id, "id"))}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        email: item.email,
        name: item.name,
        role: item.role,
      });
    });

  return (
    <Fragment>
      <MetaData title={`All User- Admin`} />

      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL Users</h1>
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

export default UserList;