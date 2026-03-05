const express = require("express");
const {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// GET /menu        → fetch all items (public — anyone can browse the menu)
// POST /menu       → add new item    (admin only)
// PUT /menu/:id    → update item     (admin only)
// DELETE /menu/:id → remove item     (admin only)

router.get("/", getMenuItems);
router.post("/", adminMiddleware, addMenuItem);
router.put("/:id", adminMiddleware, updateMenuItem);
router.delete("/:id", adminMiddleware, deleteMenuItem);

module.exports = router;
