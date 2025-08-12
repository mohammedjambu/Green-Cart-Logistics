import React, { useState, useEffect } from "react";
import api from "../api/axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/api/orders");
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading orders...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Value (₹)</th>
              <th className="px-6 py-3 text-left">Assigned Route ID</th>
              <th className="px-6 py-3 text-left">Delivery Time (HH:MM)</th>
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
                <td className="px-6 py-4">{order.delivery_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
