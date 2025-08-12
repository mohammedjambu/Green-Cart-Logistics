const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// Import all necessary Mongoose models
const Order = require("../models/order");
const Driver = require("../models/driver");
const SimulationResult = require("../models/simulationResult");

router.post("/", protect, async (req, res) => {
  try {
    const { num_drivers, max_hours } = req.body;

    if (!num_drivers || !max_hours || num_drivers <= 0 || max_hours <= 0) {
      return res.status(400).json({
        message:
          "Invalid simulation parameters. Please provide positive numbers for drivers and hours.",
      });
    }

    const [allOrders, allDrivers] = await Promise.all([
      Order.find({}).populate("route").sort({ value_rs: -1 }),
      Driver.find({}),
    ]);

    if (allDrivers.length < num_drivers) {
      return res.status(400).json({
        message: `Requested ${num_drivers} drivers, but only ${allDrivers.length} exist in the database.`,
      });
    }

    if (allOrders.length === 0) {
      return res.status(404).json({ message: "No orders found to simulate." });
    }

    const availableDrivers = allDrivers.slice(0, num_drivers).map((d) => ({
      ...d.toObject(),
      is_fatigued: d.past_week_hours.some((h) => h > 8),
      work_time: 0,
      assigned_orders: [],
    }));

    let driverIndex = 0;
    for (const order of allOrders) {
      const driver = availableDrivers[driverIndex];

      let effective_time = order.route.base_time_min;
      if (driver.is_fatigued) {
        effective_time *= 1.3;
      }

      if (driver.work_time + effective_time <= max_hours * 60) {
        driver.work_time += effective_time;
        driver.assigned_orders.push({ ...order.toObject(), effective_time });
      }

      driverIndex = (driverIndex + 1) % availableDrivers.length;
    }

    let totalProfit = 0;
    let onTimeCount = 0;
    let lateCount = 0;
    let totalFuelCost = 0;
    let fuelCostByTraffic = { Low: 0, Medium: 0, High: 0 };

    for (const driver of availableDrivers) {
      for (const order of driver.assigned_orders) {
        let currentOrderProfit = order.value_rs;
        const route = order.route;

        let fuelCost = route.distance_km * 5;
        if (route.traffic_level === "High") {
          fuelCost += route.distance_km * 2;
        }
        totalFuelCost += fuelCost;
        fuelCostByTraffic[route.traffic_level] += fuelCost;
        currentOrderProfit -= fuelCost;

        const isLate = order.effective_time > route.base_time_min + 10;

        if (isLate) {
          currentOrderProfit -= 50;
          lateCount++;
        } else {
          onTimeCount++;
          if (order.value_rs > 1000) {
            currentOrderProfit += order.value_rs * 0.1;
          }
        }

        totalProfit += currentOrderProfit;
      }
    }

    const totalDeliveries = onTimeCount + lateCount;
    const efficiencyScore =
      totalDeliveries > 0 ? (onTimeCount / totalDeliveries) * 100 : 0;

    const newSimulationResult = await SimulationResult.create({
      totalProfit,
      efficiencyScore,
      onTimeDeliveries: onTimeCount,
      lateDeliveries: lateCount,
      totalFuelCost,
      fuelCostByTraffic,
    });

    res.status(201).json(newSimulationResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error during simulation",
      error: error.message,
    });
  }
});

router.get("/history", protect, async (req, res) => {
  try {
    const history = await SimulationResult.find({}).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
