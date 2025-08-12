const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new mongoose.Schema({
  order_id: { type: Number, required: true, unique: true },
  value_rs: { type: Number, required: true },
  route: { type: Schema.Types.ObjectId, ref: "Route", required: true },
  delivery_time: { type: String },
});

module.exports = mongoose.model("Order", OrderSchema);
