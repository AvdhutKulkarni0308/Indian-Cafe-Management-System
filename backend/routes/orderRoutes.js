const express = require("express");
const router = express.Router();
const { 
  getOrders, 
  getOrderById, 
  deleteOrder, 
  createOrder 
} = require("../controllers/orderController");

router.get("/", getOrders);
router.post("/", createOrder);
router.get("/:id", getOrderById); // Add this route
router.delete("/:id", deleteOrder);

module.exports = router;
