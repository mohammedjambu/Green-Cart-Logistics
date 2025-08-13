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

// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173', // local frontend
  'https://green-cart-logistics-sigma.vercel.app' // live Vercel URL
];

// Setup CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

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
