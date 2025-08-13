import React, { useState, useEffect } from "react";
import api from "../api/axios";
import CustomModal from "../components/Modal";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({
    order_id: "",
    value_rs: "",
    route: "",
    delivery_time: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, routesRes] = await Promise.all([
        api.get("/api/orders"),
        api.get("/api/routes"),
      ]);
      setOrders(ordersRes.data);
      setRoutes(routesRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModalForCreate = () => {
    setIsEditing(false);
    setCurrentOrder({
      order_id: "",
      value_rs: "",
      route: routes[0]?._id || "",
      delivery_time: "",
    });
    setIsModalOpen(true);
  };

  const openModalForEdit = (order) => {
    setIsEditing(true);
    setCurrentOrder({ ...order, route: order.route._id });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentOrder({ ...currentOrder, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      ...currentOrder,
      order_id: Number(currentOrder.order_id),
      value_rs: Number(currentOrder.value_rs),
    };
    try {
      if (isEditing) {
        await api.put(`/api/orders/${currentOrder._id}`, orderData);
      } else {
        await api.post("/api/orders", orderData);
      }
      fetchData();
      closeModal();
    } catch (err) {
      console.error("Failed to save order", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await api.delete(`/api/orders/${id}`);
        fetchData();
      } catch (err) {
        console.error("Failed to delete order", err);
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        <button
          onClick={openModalForCreate}
          className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 hover:cursor-pointer"
        >
          + Add Order
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Value (₹)</th>
              <th className="px-6 py-3 text-left">Assigned Route ID</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4">{order.order_id}</td>
                <td className="px-6 py-4">{order.value_rs}</td>
                <td className="px-6 py-4">
                  {order.route ? order.route.route_id : "N/A"}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => openModalForEdit(order)}
                    className="text-blue-600 hover:underline hover:cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(order._id)}
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

      {/* Modal for Orders */}
      <CustomModal isOpen={isModalOpen} onRequestClose={closeModal}>
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Order" : "Add New Order"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Order ID</label>
            <input
              type="number"
              name="order_id"
              value={currentOrder.order_id}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label>Value (₹)</label>
            <input
              type="number"
              name="value_rs"
              value={currentOrder.value_rs}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label>Route</label>
            <select
              name="route"
              value={currentOrder.route}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="" disabled>
                Select a route
              </option>
              {routes.map((route) => (
                <option key={route._id} value={route._id}>
                  Route ID: {route.route_id} (Distance: {route.distance_km}km)
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label>Delivery Time (HH:MM)</label>
            <input
              type="text"
              name="delivery_time"
              value={currentOrder.delivery_time}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. 01:45"
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

export default OrdersPage;
