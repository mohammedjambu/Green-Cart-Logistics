import React, { useState, useEffect } from "react";
import api from "../api/axios";
import CustomModal from "../components/Modal";

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDriver, setCurrentDriver] = useState({
    name: "",
    shift_hours: "",
    past_week_hours: "",
  });

  const fetchDrivers = async () => {
    try {
      const { data } = await api.get("/api/drivers");
      setDrivers(data);
    } catch (err) {
      console.error("Failed to fetch drivers", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const openModalForCreate = () => {
    setIsEditing(false);
    setCurrentDriver({ name: "", shift_hours: "", past_week_hours: "" });
    setIsModalOpen(true);
  };

  const openModalForEdit = (driver) => {
    setIsEditing(true);
    setCurrentDriver({
      ...driver,
      past_week_hours: driver.past_week_hours.join(","),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDriver({ ...currentDriver, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const driverData = {
      ...currentDriver,
      shift_hours: Number(currentDriver.shift_hours),
      past_week_hours: currentDriver.past_week_hours.split(",").map(Number),
    };

    try {
      if (isEditing) {
        await api.put(`/api/drivers/${currentDriver._id}`, driverData);
      } else {
        await api.post("/api/drivers", driverData);
      }
      fetchDrivers();
      closeModal();
    } catch (err) {
      console.error("Failed to save driver", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        await api.delete(`/api/drivers/${id}`);
        fetchDrivers();
      } catch (err) {
        console.error("Failed to delete driver", err);
      }
    }
  };

  if (loading) return <p>Loading drivers...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Drivers</h1>
        <button
          onClick={openModalForCreate}
          className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 hover:cursor-pointer"
        >
          + Add Driver
        </button>
      </div>

      {/* Table to display drivers */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Shift Hours</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {drivers.map((driver) => (
              <tr key={driver._id}>
                <td className="px-6 py-4">{driver.name}</td>
                <td className="px-6 py-4">{driver.shift_hours}</td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => openModalForEdit(driver)}
                    className="text-blue-600 hover:underline hover:cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(driver._id)}
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

      {/* Modal for Creating/Editing */}
      <CustomModal isOpen={isModalOpen} onRequestClose={closeModal}>
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Driver" : "Add New Driver"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={currentDriver.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Shift Hours</label>
            <input
              type="number"
              name="shift_hours"
              value={currentDriver.shift_hours}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              Past Week Hours (comma-separated)
            </label>
            <input
              type="text"
              name="past_week_hours"
              value={currentDriver.past_week_hours}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. 8,7,6,8,9,8,7"
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

export default DriversPage;
