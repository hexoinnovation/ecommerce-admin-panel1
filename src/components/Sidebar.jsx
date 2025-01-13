import React, { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar({ setIsAuthenticated, userProfile = {} }) {
  const [isOpen, setIsOpen] = useState(false); // Sidebar toggle for mobile menu
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false); // Toggle settings dropdown

  const handleLogout = () => {
    setIsAuthenticated(false);
    window.location.href = "/login"; // Redirect to login page
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle mobile sidebar open/close
  };

  const toggleSettingsMenu = () => {
    setIsSettingsMenuOpen(!isSettingsMenuOpen); // Toggle settings dropdown
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Mobile Hamburger Icon */}
      <div className="lg:hidden p-2">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          <i
            className={`fas ${
              isOpen ? "fa-times" : "fa-bars"
            } text-2xl text-black`}
          ></i>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`lg:w-64 min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-900 text-white p-4 flex flex-col shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "transform-none" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative top-0 left-0 z-80`}
      >
        <div className="text-center mb-3">
          <h2 className="text-xl font-semibold">E-Com Admin Panel</h2>
        </div>

        {/* User Profile Section */}
        <div className="mb-4 flex items-center space-x-2">
          <div className="relative">
            <img
              src={userProfile.avatarUrl || "/default-avatar.png"} // Provide a fallback URL if avatarUrl is undefined
              alt="User Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold">
              {userProfile.name || "User Name"}
            </p>
            <p className="text-xs text-gray-300">
              {userProfile.email || "user@example.com"}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="flex-grow space-y-2">
          <li className="hover:bg-indigo-600 hover:text-white p-1 rounded-lg transition duration-150 ease-in-out transform hover:scale-105">
            <Link to="/">Dashboard</Link>
          </li>
          <li className="hover:bg-indigo-600 hover:text-white p-1 rounded-lg transition duration-150 ease-in-out transform hover:scale-105">
            <Link to="/products">Products</Link>
          </li>
          <li className="hover:bg-indigo-600 hover:text-white p-1 rounded-lg transition duration-150 ease-in-out transform hover:scale-105">
            <Link to="/orders">Orders</Link>
          </li>
          <li className="hover:bg-indigo-600 hover:text-white p-1 rounded-lg transition duration-150 ease-in-out transform hover:scale-105">
            <Link to="/customers">Customers</Link>
          </li>
          <li className="hover:bg-indigo-600 hover:text-white p-1 rounded-lg transition duration-150 ease-in-out transform hover:scale-105">
            <Link to="/categories">Categories</Link>
          </li>
          <li className="hover:bg-indigo-600 hover:text-white p-1 rounded-lg transition duration-150 ease-in-out transform hover:scale-105">
            <Link to="/coupons">Coupons</Link>
          </li>
          <li className="hover:bg-indigo-600 hover:text-white p-1 rounded-lg transition duration-150 ease-in-out transform hover:scale-105">
            <Link to="/vendors">Vendors</Link>
          </li>
          {/* Additional Controls for eCommerce Admin Panel */}
          <li className="hover:bg-indigo-600 hover:text-white p-1 rounded-lg transition duration-150 ease-in-out transform hover:scale-105">
            <Link to="/payments">Payment Methods</Link>
          </li>
          <li className="hover:bg-indigo-600 hover:text-white p-1 rounded-lg transition duration-150 ease-in-out transform hover:scale-105">
            <Link to="/shipping">Shipping Settings</Link>
          </li>
          <li className="hover:bg-indigo-600 hover:text-white p-1 rounded-lg transition duration-150 ease-in-out transform hover:scale-105">
            <Link to="/reports">Reports</Link>
          </li>
        </ul>

        {/* Settings Dropdown */}
        <div className="mt-4">
          <button
            onClick={toggleSettingsMenu} // Toggle settings menu dropdown
            className="w-full text-white py-2 px-3 bg-indigo-500 rounded-lg hover:bg-indigo-400 transition duration-150 ease-in-out"
          >
            Settings
          </button>

          {/* Settings Dropdown Menu (one-by-one display) */}
          {isSettingsMenuOpen && (
            <div className="space-y-1 mt-2 bg-indigo-800 p-3 rounded-lg shadow-lg">
              <Link
                to="/profile"
                className="block text-white py-1 px-4 hover:bg-indigo-700 rounded-lg"
              >
                View Profile
              </Link>
              <Link
                to="/account-settings"
                className="block text-white py-1 px-4 hover:bg-indigo-700 rounded-lg"
              >
                Account Settings
              </Link>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-4 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-150 ease-in-out transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } fixed top-0 left-0 w-full h-screen bg-black opacity-50 lg:hidden`}
        onClick={toggleSidebar} // Close sidebar when overlay is clicked
      ></div>
    </div>
  );
}

export default Sidebar;
