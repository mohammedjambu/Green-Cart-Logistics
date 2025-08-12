import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runSimulation = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/api/simulate");
      setKpiData(data);
    } catch (err) {
      setError("Failed to run simulation.");
      console.error(err);
    }
    setLoading(false);
  };

  // fetch simulation result
  useEffect(() => {
    const fetchLatestSim = async () => {
      try {
        const { data } = await api.get("/api/simulate/history");
        if (data && data.length > 0) {
          setKpiData(data[0]); // newest result
        }
      } catch (err) {
        console.error("Could not fetch history", err);
      }
    };
    fetchLatestSim();
  }, []);

  const chartData = {
    labels: ["Deliveries"],
    datasets: [
      {
        label: "On-Time",
        data: [kpiData?.onTimeDeliveries || 0],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Late",
        data: [kpiData?.lateDeliveries || 0],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">GreenCart KPI Dashboard</h1>
      <button
        onClick={runSimulation}
        disabled={loading}
        className="px-6 py-2 mb-8 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Simulating..." : "Run New Simulation"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {kpiData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <p className="text-4xl font-bold text-blue-600">
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
          <div className="md:col-span-3 p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">
              On-Time vs Late Deliveries
            </h3>
            <Bar data={chartData} />
          </div>
        </div>
      ) : (
        <p>Run a simulation to see the results.</p>
      )}
    </div>
  );
};

export default DashboardPage;
