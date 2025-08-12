const express = require("express");
const router = express.Router();
const Driver = require("../models/driver");
const { protect } = require("../middleware/authMiddleware");

// all drivers route
router.get("/", protect, async (req, res) => {
  try {
    const drivers = await Driver.find({});
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Create a new driver route
router.post("/", protect, async (req, res) => {
  try {
    const { name, shift_hours, past_week_hours } = req.body;

    const driver = new Driver({
      name,
      shift_hours,
      past_week_hours,
    });

    const createdDriver = await driver.save();
    res.status(201).json(createdDriver);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Update a driver route
router.put("/:id", protect, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (driver) {
      driver.name = req.body.name || driver.name;
      driver.shift_hours = req.body.shift_hours || driver.shift_hours;
      driver.past_week_hours =
        req.body.past_week_hours || driver.past_week_hours;

      const updatedDriver = await driver.save();
      res.json(updatedDriver);
    } else {
      res.status(404).json({ message: "Driver not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a driver route
router.delete("/:id", protect, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (driver) {
      await driver.deleteOne();
      res.json({ message: "Driver removed" });
    } else {
      res.status(404).json({ message: "Driver not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
