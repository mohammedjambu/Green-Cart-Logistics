const express = require("express");
const router = express.Router();
const Route = require("../models/route");
const { protect } = require("../middleware/authMiddleware");

// @desc    Get all routes
// @route   GET /api/routes
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const routes = await Route.find({});
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Create a new route
// @route   POST /api/routes
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { route_id, distance_km, traffic_level, base_time_min } = req.body;

    const newRoute = new Route({
      route_id,
      distance_km,
      traffic_level,
      base_time_min,
    });

    const createdRoute = await newRoute.save();
    res.status(201).json(createdRoute);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc    Update a route by its MongoDB _id
// @route   PUT /api/routes/:id
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const { route_id, distance_km, traffic_level, base_time_min } = req.body;
    const route = await Route.findById(req.params.id);

    if (route) {
      route.route_id = route_id || route.route_id;
      route.distance_km = distance_km || route.distance_km;
      route.traffic_level = traffic_level || route.traffic_level;
      route.base_time_min = base_time_min || route.base_time_min;

      const updatedRoute = await route.save();
      res.json(updatedRoute);
    } else {
      res.status(404).json({ message: "Route not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Delete a route by its MongoDB _id
// @route   DELETE /api/routes/:id
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (route) {
      await route.deleteOne();
      res.json({ message: "Route removed" });
    } else {
      res.status(404).json({ message: "Route not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
