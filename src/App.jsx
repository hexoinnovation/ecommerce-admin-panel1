import React, { useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./components/Products";
import Orders from "./pages/Orders";
import Customers from "./components/Customers";
import Categories from "./components/Categories";
import Coupons from "./components/Coupons";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vendors from "./components/Vendors";
import Payments from "./pages/payments";
import Shipping from "./pages/shipping";
import Reports from "./pages/reports";
import Profile from "./pages/profile";
import Accountsettings from "./pages/account-settings";
import { ThemeContext } from "./context/ThemeContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { layout, changeLayout } = useContext(ThemeContext); // Consuming ThemeContext

  // Ensure that the layout object is defined and the properties are accessible
  if (!layout) return null; // Optional: Add a fallback if layout is not yet defined

  // Update the CSS variable for dynamic design changes
  document.documentElement.style.setProperty(
    "--primary-color",
    layout.primaryColor
  );
  document.documentElement.style.setProperty(
    "--background-color",
    layout.backgroundColor
  );
  document.documentElement.style.setProperty(
    "--sidebar-color",
    layout.sidebarColor
  );
  document.documentElement.style.setProperty(
    "--button-color",
    layout.buttonColor
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: layout.backgroundColor }}
    >
      <div className="flex">
        {/* Sidebar with dynamic background color */}
        {isAuthenticated && (
          <Sidebar
            primaryColor={layout.primaryColor} // Pass dynamic color to Sidebar
            setIsAuthenticated={setIsAuthenticated}
            sidebarColor={layout.sidebarColor} // Pass dynamic sidebar color
            sidebarWidth="250px" // Fixed sidebar width
            changeLayout={changeLayout} // Pass changeLayout function to Sidebar
          />
        )}

        <div className="flex-1 p-8">
          
            {/* Routing setup */}
            <Routes>
              <Route
                path="/login"
                element={<Login setIsAuthenticated={setIsAuthenticated} />}
              />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/profile"
                element={
                  isAuthenticated ? <Profile /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/account-settings"
                element={
                  isAuthenticated ? (
                    <Accountsettings />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/products"
                element={
                  isAuthenticated ? <Products /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/orders"
                element={
                  isAuthenticated ? <Orders /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/payments"
                element={
                  isAuthenticated ? <Payments /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/shipping"
                element={
                  isAuthenticated ? <Shipping /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/reports"
                element={
                  isAuthenticated ? <Reports /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/customers"
                element={
                  isAuthenticated ? <Customers /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/categories"
                element={
                  isAuthenticated ? <Categories /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/vendors"
                element={
                  isAuthenticated ? <Vendors /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/coupons"
                element={
                  isAuthenticated ? <Coupons /> : <Navigate to="/login" />
                }
              />
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </div>
        </div>
      
    </div>
  );
}

// WrappedApp component that wraps the App inside the ThemeProvider
export default function WrappedApp() {
  return (
    <ThemeProvider>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  );
}
