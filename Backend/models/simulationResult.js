const mongoose = require("mongoose");

const SimulationResultSchema = new mongoose.Schema(
  {
    totalProfit: { type: Number, required: true },
    efficiencyScore: { type: Number, required: true },
    onTimeDeliveries: { type: Number, required: true },
    lateDeliveries: { type: Number, required: true },
    totalFuelCost: { type: Number, required: true },
    fuelCostByTraffic: {
      Low: { type: Number, default: 0 },
      Medium: { type: Number, default: 0 },
      High: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SimulationResult", SimulationResultSchema);
