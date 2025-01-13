import React, { useState } from "react";
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
import Customers from "./components/Customers"; // Import the Customers page
import Categories from "./components/Categories"; // Import Categories page
import Coupons from "./components/Coupons"; // Import Coupons page
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vendors from "./components/Vendors";
import Payments from "./pages/payments";
import Shipping from "./pages/shipping";
import Reports from "./pages/reports";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="flex">
        {/* If logged in, show Sidebar */}
        {isAuthenticated && <Sidebar setIsAuthenticated={setIsAuthenticated} />}

        <div className="flex-1 p-8">
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
              path="/products"
              element={
                isAuthenticated ? <Products /> : <Navigate to="/login" />
              }
            />

            <Route
              path="/orders"
              element={isAuthenticated ? <Orders /> : <Navigate to="/login" />}
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
              element={isAuthenticated ? <Reports /> : <Navigate to="/login" />}
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
              element={isAuthenticated ? <Vendors /> : <Navigate to="/login" />}
            />

            <Route
              path="/coupons"
              element={isAuthenticated ? <Coupons /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
