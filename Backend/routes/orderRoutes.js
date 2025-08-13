const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const { protect } = require("../middleware/authMiddleware");

// Get all orders,
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("route");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Create a new order
router.post("/", protect, async (req, res) => {
  try {
    const { order_id, value_rs, route, delivery_time } = req.body;

    const newOrder = new Order({
      order_id,
      value_rs,
      route,
      delivery_time,
    });

    const createdOrder = await newOrder.save();
    await createdOrder.populate("route");
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Update an order
router.put("/:id", protect, async (req, res) => {
  try {
    const { order_id, value_rs, route, delivery_time } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.order_id = order_id || order.order_id;
      order.value_rs = value_rs || order.value_rs;
      order.route = route || order.route;
      order.delivery_time = delivery_time || order.delivery_time;

      const updatedOrder = await order.save();
      await updatedOrder.populate("route");
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete an order
router.delete("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await order.deleteOne();
      res.json({ message: "Order removed" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
