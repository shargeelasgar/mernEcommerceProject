const express  = require("express");
const { newOrder, getsingleOrder, myOrders, getAllOrders, updateOrderStatus, deleteOrders } = require("../controllers/orderController");
const { isAuthenticated,authrizeRoles } = require("../middlewares/auth");

const router = express.Router()
// create Order
router.route('/order/new').post(isAuthenticated,newOrder)
// get logged in user single Order
router.route('/order/:id').get(isAuthenticated,getsingleOrder)
// get logged in user orders
router.route('/orders/me').get(isAuthenticated,myOrders)
// get all orders for (admin)
router.route('/admin/orders').get(isAuthenticated,authrizeRoles("admin"),getAllOrders)
// update order or orderStatus
router.route('/admin/order/:id').put(isAuthenticated,authrizeRoles("admin"),updateOrderStatus)
// delete order 
router.route('/admin/order/:id').delete(isAuthenticated,authrizeRoles("admin"),deleteOrders)
module.exports = router;