const express = require("express");
const router = express.Router();
const Route = require("../models/route");
const { protect } = require("../middleware/authMiddleware");

// all routes
router.get("/", protect, async (req, res) => {
  try {
    const routes = await Route.find({});
    res.json(routes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
