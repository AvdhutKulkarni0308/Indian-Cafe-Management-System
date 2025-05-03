const MenuItem = require("../models/MenuItem");

// GET all menu items
const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};

// POST a new menu item
const addMenuItem = async (req, res) => {
  try {
    const { name, category, price, description } = req.body;
    const newItem = new MenuItem({ name, category, price, description });
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to add menu item" });
  }
};

// PUT (update) a menu item
const updateMenuItem = async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update menu item" });
  }
};

// DELETE a menu item
const deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete item" });
  }
};

module.exports = {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
