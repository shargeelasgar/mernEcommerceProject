const express  = require("express")
const { getAllProducts , createProduct, updateProduct, deleteProduct, getSingleProduct, createProductReview, getProductReviews, DeleteProductReviews, getAdminProducts } = require("../controllers/productController");
const { isAuthenticated,authrizeRoles } = require("../middlewares/auth");

const router = express.Router()
// Get product
router.route("/products").get(getAllProducts);

router.route("/admin/products").get(isAuthenticated,authrizeRoles("admin"),getAdminProducts);

// Create product
router.route("/admin/product/new").post(isAuthenticated,authrizeRoles("admin"),createProduct);

// update products

router.route("/admin/product/:id").put(isAuthenticated,authrizeRoles("admin"),updateProduct);

// Deleted product

router.route("/admin/product/:id").delete(isAuthenticated,authrizeRoles("admin"),deleteProduct);

// get single product

router.route("/product/:id").get(getSingleProduct);

// createProductReview

router.route("/review").put(isAuthenticated,createProductReview)

// get Product Reviews 

router.route("/reviews").get(getProductReviews)
//Delete Product Reviews 

router.route("/review").delete(isAuthenticated,DeleteProductReviews)


module.exports = router