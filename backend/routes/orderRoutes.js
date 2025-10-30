const express = require("express");
const router = express.Router();
const { 
  getOrders, 
  getOrderById, 
  deleteOrder, 
  createOrder 
} = require("../controllers/orderController");
const authMiddleware = require('../middleware/authMiddleware');

router.get("/", getOrders);
router.post("/", authMiddleware, createOrder); // Protected route
router.get("/:id", getOrderById);
router.delete("/:id", deleteOrder);

module.exports = router;
