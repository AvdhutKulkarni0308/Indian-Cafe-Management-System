const Order = require("../models/Order");

// GET all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("customer", "email") // Joins User to get email
      .select("-__v");
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// GET single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "email") // Joins User to get email
      .select("-__v");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// POST a new order
const createOrder = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const { items, total, tableNumber } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must contain items" });
    }
    if (!tableNumber || tableNumber.trim() === "") {
      return res.status(400).json({ error: "Table Number is required" });
    }

    const newOrder = new Order({
      customer: req.user.userId,
      items,
      total,
      tableNumber,
      createdAt: new Date(),
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(400).json({ error: "Failed to create order" });
  }
};

// DELETE an order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(400).json({ error: "Failed to delete order" });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  deleteOrder,
  createOrder,
};
