import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage = () => {
  const [kpiData, setKpiData] = useState(null);

  const [numDrivers, setNumDrivers] = useState(10);
  const [maxHours, setMaxHours] = useState(8);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runSimulation = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/api/simulate", {
        num_drivers: Number(numDrivers),
        max_hours: Number(maxHours),
      });
      setKpiData(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to run simulation. Please try again."
      );
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchLatestSim = async () => {
      try {
        const { data } = await api.get("/api/simulate/history");
        if (data && data.length > 0) {
          setKpiData(data[0]);
        }
      } catch (err) {
        console.error("Could not fetch simulation history", err);
      }
    };
    fetchLatestSim();
  }, []);

  const deliveryChartData = {
    labels: ["Deliveries"],
    datasets: [
      {
        label: "On-Time",
        data: [kpiData?.onTimeDeliveries || 0],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Late",
        data: [kpiData?.lateDeliveries || 0],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const fuelChartData = {
    labels: ["Low Traffic", "Medium Traffic", "High Traffic"],
    datasets: [
      {
        label: "Fuel Cost (₹)",
        data: [
          kpiData?.fuelCostByTraffic?.Low || 0,
          kpiData?.fuelCostByTraffic?.Medium || 0,
          kpiData?.fuelCostByTraffic?.High || 0,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">GreenCart KPI Dashboard</h1>

      {/* Simulation Input Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Run New Simulation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label
              htmlFor="numDrivers"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Number of Available Drivers
            </label>
            <input
              id="numDrivers"
              type="number"
              value={numDrivers}
              onChange={(e) => setNumDrivers(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="1"
            />
          </div>
          <div>
            <label
              htmlFor="maxHours"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Max Hours per Driver
            </label>
            <input
              id="maxHours"
              type="number"
              value={maxHours}
              onChange={(e) => setMaxHours(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="1"
            />
          </div>
          <div>
            <button
              onClick={runSimulation}
              disabled={loading}
              className="w-full px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Simulating..." : "Run Simulation"}
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      {/* KPI Display Area */}
      {kpiData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* KPI Cards */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">
              Total Profit
            </h3>
            <p className="text-4xl font-bold text-green-600">
              ₹{kpiData.totalProfit.toFixed(2)}
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">
              Efficiency Score
            </h3>
            <p className="text-4xl font-bold text-indigo-600">
              {kpiData.efficiencyScore.toFixed(1)}%
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">
              Total Fuel Cost
            </h3>
            <p className="text-4xl font-bold text-yellow-600">
              ₹{kpiData.totalFuelCost.toFixed(2)}
            </p>
          </div>

          {/* Charts */}
          <div className="md:col-span-2 lg:col-span-2 p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">
              On-Time vs Late Deliveries
            </h3>
            <div className="h-64">
              <Bar
                data={deliveryChartData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-1 p-6 bg-white rounded-lg shadow flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Fuel Cost Breakdown</h3>
            <div className="w-64 h-64">
              <Doughnut
                data={fuelChartData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {loading
              ? "Loading initial data..."
              : "Run a simulation to see the results."}
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
