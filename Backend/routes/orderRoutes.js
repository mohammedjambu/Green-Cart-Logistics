const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // We use .populate('route') to include the full route details with each order
    const orders = await Order.find({}).populate('route');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;