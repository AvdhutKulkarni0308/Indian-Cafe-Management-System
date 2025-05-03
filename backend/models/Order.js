const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: String,
    default: "Anonymous",
  },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  total: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
