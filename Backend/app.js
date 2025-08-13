const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Import route files
const driverRoutes = require("./routes/driverRoutes");
const authRoutes = require("./routes/authRoutes");
const routeRoutes = require("./routes/routeRoutes");
const orderRoutes = require("./routes/orderRoutes");
const simulationRoutes = require("./routes/simulationRoutes");

dotenv.config();

// Connect to database
connectDB();

const app = express();

app.use(cors());

app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("GreenCart Logistics API is running...");
});

// Route Files
app.use("/api/auth", authRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/simulate", simulationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
