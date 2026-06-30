import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./layouts/Navbar";
import Hero from "./components/Hero";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import SupplierDashboard from "./pages/SupplierDashboard";
import TransporterDashboard from "./pages/TransporterDashboard";
import WarehouseDashboard from "./pages/WarehouseDashboard";

const App = () => {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
        <Navbar />

        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Hero />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["Supplier", "SuperAdmin"]} />
              }
            >
              <Route
                path="/supplier-dashboard"
                element={<SupplierDashboard />}
              />
            </Route>

            <Route
              element={
                <ProtectedRoute allowedRoles={["Transporter", "SuperAdmin"]} />
              }
            >
              <Route
                path="/transporter-dashboard"
                element={<TransporterDashboard />}
              />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["WarehouseManager", "SuperAdmin"]}
                />
              }
            >
              <Route
                path="/warehouse-dashboard"
                element={<WarehouseDashboard />}
              />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
