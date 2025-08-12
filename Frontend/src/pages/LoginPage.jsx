import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">GreenCart Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
