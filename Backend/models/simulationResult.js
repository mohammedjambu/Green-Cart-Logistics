const mongoose = require("mongoose");

const SimulationResultSchema = new mongoose.Schema(
  {
    totalProfit: { type: Number, required: true },
    efficiencyScore: { type: Number, required: true },
    onTimeDeliveries: { type: Number, required: true },
    lateDeliveries: { type: Number, required: true },
    totalFuelCost: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SimulationResult", SimulationResultSchema);
