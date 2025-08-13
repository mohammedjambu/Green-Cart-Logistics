import React, { useState, useEffect } from "react";
import api from "../api/axios";
import CustomModal from "../components/Modal";

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoute, setCurrentRoute] = useState({
    route_id: "",
    distance_km: "",
    traffic_level: "Low",
    base_time_min: "",
  });

  const fetchRoutes = async () => {
    try {
      const { data } = await api.get("/api/routes");
      setRoutes(data);
    } catch (err) {
      console.error("Failed to fetch routes", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const openModalForCreate = () => {
    setIsEditing(false);
    setCurrentRoute({
      route_id: "",
      distance_km: "",
      traffic_level: "Low",
      base_time_min: "",
    });
    setIsModalOpen(true);
  };

  const openModalForEdit = (route) => {
    setIsEditing(true);
    setCurrentRoute(route);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoute({ ...currentRoute, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const routeData = {
      ...currentRoute,
      route_id: Number(currentRoute.route_id),
      distance_km: Number(currentRoute.distance_km),
      base_time_min: Number(currentRoute.base_time_min),
    };

    try {
      if (isEditing) {
        await api.put(`/api/routes/${currentRoute._id}`, routeData);
      } else {
        await api.post("/api/routes", routeData);
      }
      fetchRoutes();
      closeModal();
    } catch (err) {
      console.error("Failed to save route", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        await api.delete(`/api/routes/${id}`);
        fetchRoutes();
      } catch (err) {
        console.error("Failed to delete route", err);
      }
    }
  };

  if (loading) return <p>Loading routes...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Routes</h1>
        <button
          onClick={openModalForCreate}
          className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 hover:cursor-pointer"
        >
          + Add Route
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">Route ID</th>
              <th className="px-6 py-3 text-left">Distance (km)</th>
              <th className="px-6 py-3 text-left">Traffic Level</th>
              <th className="px-6 py-3 text-left">Base Time (min)</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {routes.map((route) => (
              <tr key={route._id}>
                <td className="px-6 py-4">{route.route_id}</td>
                <td className="px-6 py-4">{route.distance_km}</td>
                <td className="px-6 py-4">{route.traffic_level}</td>
                <td className="px-6 py-4">{route.base_time_min}</td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => openModalForEdit(route)}
                    className="text-blue-600 hover:underline hover:cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(route._id)}
                    className="text-red-600 hover:underline hover:cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Routes */}
      <CustomModal isOpen={isModalOpen} onRequestClose={closeModal}>
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Route" : "Add New Route"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Route ID</label>
            <input
              type="number"
              name="route_id"
              value={currentRoute.route_id}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label>Distance (km)</label>
            <input
              type="number"
              name="distance_km"
              value={currentRoute.distance_km}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label>Traffic Level</label>
            <select
              name="traffic_level"
              value={currentRoute.traffic_level}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label>Base Time (min)</label>
            <input
              type="number"
              name="base_time_min"
              value={currentRoute.base_time_min}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </CustomModal>
    </div>
  );
};

export default RoutesPage;
