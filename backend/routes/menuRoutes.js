const express = require("express");
const {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const router = express.Router();

// GET /menu        → fetch all items
// POST /menu       → add new item
// PUT /menu/:id    → update existing item
// DELETE /menu/:id → remove item

router.get("/", getMenuItems);
router.post("/", addMenuItem);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

module.exports = router;
