// src/pages/AdminPanel.js
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext

function AdminPanel() {
  const { darkMode, primaryColor, toggleDarkMode } = useContext(ThemeContext); // Get theme settings from context

  if (darkMode === undefined || primaryColor === undefined) {
    return <div>Error: Theme context not available</div>;
  }

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-blue-200 text-black"
      } min-h-screen flex`}
    >
      <div
        className="w-64 p-6"
        style={{
          backgroundColor: primaryColor, // Dynamically set the sidebar color
        }}
      >
        <h2 className="text-2xl font-semibold text-white mb-8">
          Admin Dashboard
        </h2>
        <ul className="space-y-4">
          <li>
            <button className="text-white hover:underline">
              Profile Settings
            </button>
          </li>
          <li>
            <button className="text-white hover:underline">
              Appearance Settings
            </button>
          </li>
          <li>
            <button
              onClick={() => alert("Signed Out")}
              className="text-white hover:underline"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-8">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome to the Admin Panel
          </h2>
          <p>Manage your settings from here.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
