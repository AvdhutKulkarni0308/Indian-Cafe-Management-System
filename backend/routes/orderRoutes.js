const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrderById,
  deleteOrder,
  createOrder,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", adminMiddleware, getOrders); // Admin only — view all orders
router.post("/", authMiddleware, createOrder); // Any logged-in user — place order
router.get("/:id", authMiddleware, getOrderById); // Any logged-in user — view their order
router.delete("/:id", adminMiddleware, deleteOrder); // Admin only — delete order

module.exports = router;
