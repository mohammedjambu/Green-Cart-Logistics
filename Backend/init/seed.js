const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const csv = require("csv-parser");
const dotenv = require("dotenv");

dotenv.config();

// Import models
const Driver = require("../models/driver");
const Route = require("../models/route");
const Order = require("../models/order");

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log("MongoDB Connected for Seeding...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    // Clear existing data
    await Driver.deleteMany();
    await Route.deleteMany();
    await Order.deleteMany();
    console.log("Old data cleared.");

    // SEED ROUTES FIRST
    const routes = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, "./routes.csv"))
        .pipe(csv())
        .on("data", (row) => routes.push(row))
        .on("end", async () => {
          await Route.insertMany(routes);
          console.log("Routes Imported!");
          resolve();
        })
        .on("error", reject);
    });

    // SEED DRIVERS
    const drivers = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, "./drivers.csv"))
        .pipe(csv())
        .on("data", (row) => {
          // Convert past_week_hours from string "6|8|..." to array [6, 8, ...]
          row.past_week_hours = row.past_week_hours.split("|").map(Number);
          drivers.push(row);
        })
        .on("end", async () => {
          await Driver.insertMany(drivers);
          console.log("Drivers Imported!");
          resolve();
        })
        .on("error", reject);
    });

    // SEED ORDERS AND LINK THEM TO ROUTES 
    const orders = [];
    const dbRoutes = await Route.find();
    const routeMap = new Map(
      dbRoutes.map((r) => [r.route_id.toString(), r._id])
    );

    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, "./orders.csv"))
        .pipe(csv())
        .on("data", (row) => {
          const routeId = routeMap.get(row.route_id);
          if (routeId) {
            orders.push({ ...row, route: routeId });
          }
        })
        .on("end", async () => {
          await Order.insertMany(orders);
          console.log("Orders Imported!");
          resolve();
        })
        .on("error", reject);
    });

    console.log("Data Seeding Complete!");
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

// Connect to DB then run the import
connectDB().then(() => {
  importData();
});
