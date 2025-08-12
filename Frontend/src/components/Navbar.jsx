import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
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
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">GreenCart Admin</h1>
        <div className="flex items-center space-x-6">
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
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
