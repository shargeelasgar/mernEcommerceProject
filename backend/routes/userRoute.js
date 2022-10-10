const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updateUserPassword,
  updateUserDetails,
  getsingleUser,
  getAllUsers,
  updateUserRole,
  DeleteUser,
} = require("../controllers/userConroller");
const { isAuthenticated, authrizeRoles } = require("../middlewares/auth");
const router = express.Router();
//register
router.route("/register").post(registerUser);
//login
router.route("/login").post(loginUser);
// Forget password mail
router.route("/password/forget").post(forgotPassword);
// resetPassword
router.route("/password/reset/:token").put(resetPassword);
//Logout
router.route("/logout").get(logout);
// get user detail
router.route("/me").get(isAuthenticated, getUserDetails);
//Reset password
router.route("/password/update").put(isAuthenticated, updateUserPassword);
//Update user profile
router.route("/me/update").put(isAuthenticated, updateUserDetails);
// get All users (admin)
router.route("/admin/users").get(isAuthenticated,authrizeRoles("admin"), getAllUsers);
// get single user (admin)
router.route("/admin/single/user/:id").get(isAuthenticated,authrizeRoles("admin"), getsingleUser);
// update user role (admin)
router.route("/admin/single/user/:id").put(isAuthenticated,authrizeRoles("admin"), updateUserRole);
// Delet user  (admin)
router.route("/admin/single/user/:id").delete(isAuthenticated,authrizeRoles("admin"), DeleteUser);


module.exports = router;
