import React, { useState, useEffect } from "react";
import api from "../api/axios";

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { data } = await api.get("/api/routes");
        setRoutes(data);
      } catch (err) {
        console.error("Failed to fetch routes", err);
      }
      setLoading(false);
    };
    fetchRoutes();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading routes...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Routes</h1>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">Route ID</th>
              <th className="px-6 py-3 text-left">Distance (km)</th>
              <th className="px-6 py-3 text-left">Traffic Level</th>
              <th className="px-6 py-3 text-left">Base Time (min)</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {routes.map((route) => (
              <tr key={route._id}>
                <td className="px-6 py-4">{route.route_id}</td>
                <td className="px-6 py-4">{route.distance_km}</td>
                <td className="px-6 py-4">{route.traffic_level}</td>
                <td className="px-6 py-4">{route.base_time_min}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoutesPage;
