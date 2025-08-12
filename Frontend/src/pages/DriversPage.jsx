import React, { useState, useEffect } from "react";
import api from "../api/axios";

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const { data } = await api.get("/api/drivers");
        setDrivers(data);
      } catch (err) {
        console.error("Failed to fetch drivers", err);
      }
      setLoading(false);
    };
    fetchDrivers();
  }, []);

  if (loading) return <p>Loading drivers...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Drivers</h1>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Shift Hours</th>
              <th className="px-6 py-3 text-left">Past Week Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {drivers.map((driver) => (
              <tr key={driver._id}>
                <td className="px-6 py-4">{driver.name}</td>
                <td className="px-6 py-4">{driver.shift_hours}</td>
                <td className="px-6 py-4">
                  {driver.past_week_hours.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriversPage;
