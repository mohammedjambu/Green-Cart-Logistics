const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import your Mongoose models
const Order = require('../models/order');
const SimulationResult = require('../models/simulationResult');

// Run a new delivery simulation
router.post('/', protect, async (req, res) => {
    try {
        const ordersToProcess = await Order.find({}).populate('route');

        if (!ordersToProcess || ordersToProcess.length === 0) {
            return res.status(404).json({ message: 'No orders found to simulate.' });
        }

        // Initialize KPI counters
        let totalProfit = 0;
        let onTimeCount = 0;
        let lateCount = 0;
        let totalFuelCost = 0;

        for (const order of ordersToProcess) {
            let currentOrderProfit = order.value_rs;
            const route = order.route;

            let fuelCost = route.distance_km * 5;
            if (route.traffic_level === 'High') {
                fuelCost += route.distance_km * 2;
            }
            totalFuelCost += fuelCost;
            currentOrderProfit -= fuelCost;

            const timeParts = order.delivery_time.split(':');
            const deliveryTimeInMin = parseInt(timeParts[0], 10) * 60 + parseInt(timeParts[1], 10);
            
            const isLate = deliveryTimeInMin > (route.base_time_min + 10);

            if (isLate) {
                currentOrderProfit -= 50;
                lateCount++;
            } else {
                onTimeCount++;
                if (order.value_rs > 1000) {
                    currentOrderProfit += order.value_rs * 0.10;
                }
            }
            
            totalProfit += currentOrderProfit;
        }

        // Calculate final KPIs
        const totalDeliveries = ordersToProcess.length;
        const efficiencyScore = totalDeliveries > 0 ? (onTimeCount / totalDeliveries) * 100 : 0;

        // Save the result to the Database
        const newSimulationResult = await SimulationResult.create({
            totalProfit,
            efficiencyScore,
            onTimeDeliveries: onTimeCount,
            lateDeliveries: lateCount,
            totalFuelCost
        });

        // Return the calculated KPIs to the frontend
        res.status(201).json(newSimulationResult);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error during simulation", error: error.message });
    }
});

// history of all past simulations, newest first
router.get('/history', protect, async (req, res) => {
    try {
        const history = await SimulationResult.find({}).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;