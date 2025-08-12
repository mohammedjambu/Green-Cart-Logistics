import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const navLinkStyles = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
      color: isActive ? "#10B981" : "white", // Emerald green for active
    };
  };

  return (
    <nav className="bg-gray-700 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">GreenCart Admin</h1>

        {/* Desktop Menu (Visible on medium screens and up) */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink
            to="/dashboard"
            style={navLinkStyles}
            className="hover:text-gray-300"
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/drivers"
            style={navLinkStyles}
            className="hover:text-gray-300"
          >
            Drivers
          </NavLink>
          <NavLink
            to="/routes"
            style={navLinkStyles}
            className="hover:text-gray-300"
          >
            Routes
          </NavLink>
          <NavLink
            to="/orders"
            style={navLinkStyles}
            className="hover:text-gray-300"
          >
            Orders
          </NavLink>
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Hamburger Menu Button (Visible on small screens) */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <NavLink
            to="/dashboard"
            style={navLinkStyles}
            className="block py-2 px-4 text-sm hover:bg-gray-700 rounded"
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/drivers"
            style={navLinkStyles}
            className="block py-2 px-4 text-sm hover:bg-gray-700 rounded"
          >
            Drivers
          </NavLink>
          <NavLink
            to="/routes"
            style={navLinkStyles}
            className="block py-2 px-4 text-sm hover:bg-gray-700 rounded"
          >
            Routes
          </NavLink>
          <NavLink
            to="/orders"
            style={navLinkStyles}
            className="block py-2 px-4 text-sm hover:bg-gray-700 rounded"
          >
            Orders
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full text-left mt-2 py-2 px-4 text-sm bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
