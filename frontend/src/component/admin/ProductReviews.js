import React, { Fragment, useEffect,useState  } from "react";
import { DataGrid } from '@mui/x-data-grid';
import "./ProductReviews.css";
import { useSelector, useDispatch} from "react-redux";
import {
  clearErrors,
  getAllReview,
  deleteReview,
} from "../../actions/productAction";
import { useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import Star from '@mui/icons-material/Star'
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar";
import { DELETE_REVIEW_RESET } from "../../constents/productConstents";

const ProductReviews = () => {
  const notyf = new Notyf({
    type: "error",
    position: { x: "right", y: "top" },
    ripple: true,
    dismissible: false,
    duration: 2000,
  });


  const history = useNavigate();
  const dispatch = useDispatch();
  const { error, reviews,loading } = useSelector((state) => state.productReview);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.review
  );
  const [productId,setProductId] = useState("");
  const deleteReviewHandler = (id) => {
    dispatch(deleteReview(id,productId));
  };
  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllReview(productId)) 
  }
  useEffect(() => {
    if(productId.length === 24){
      dispatch(getAllReview(productId)) 
    }
    if (error) {
      notyf.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      notyf.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      notyf.success("Review Deleted Successfully");
      history("/admin/reviews");
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [dispatch, error, deleteError, isDeleted, history,productId])

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },
    {
      field: "user",
      headerName: "User",
      minWidth: 200,
      flex: 0.6,
    },
    { field: "comment", headerName: "Comment", minWidth: 350, flex: 1 },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 180,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, "rating") >= 3 ? "greenColor" : "redColor"
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
            <Button
              onClick={() =>
                deleteReviewHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
       rating: item.rating,
       comment: item.comment,
        user: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`All Reviews - Admin`} />

      <div className="dashboard">
        <Sidebar />
        <div className="productReviewsContainer">

        <form className="productReviewsForm"  onSubmit={productReviewsSubmitHandler}>
           <h1 className="productReviewsFormHeading">All Reviews</h1>
           <div>
                <Star />
                <input
                  type="text"
                  placeholder="Product Id"
                  required
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
              </div>             
           <Button
             id="createProductBtn"
             type="submit"
             disabled={loading ? true : false || productId === "" ? true : false}
           >
            Search
           </Button>
         </form>
          {reviews && reviews.length > 0 ?  (<DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />) : (<h1 className="productReviewsFormHeading">No Reviews Found </h1>) }
        </div>
      </div>
    </Fragment>
  );
};

export default ProductReviews;
