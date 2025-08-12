import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DriversPage from "./pages/DriversPage";
import RoutesPage from "./pages/RoutesPage";
import OrdersPage from "./pages/OrdersPage";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/orders" element={<OrdersPage />} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
