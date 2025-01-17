import React, { useState, useEffect } from "react";

function Dashboard() {
  const [currentDateTime, setCurrentDateTime] = useState(""); // State to store current date and time

  // Function to update the current date and time every second
  const updateDateTime = () => {
    const now = new Date();
    const formattedDateTime = now.toLocaleString(); // Formats the date and time in a readable format
    setCurrentDateTime(formattedDateTime);
  };

  useEffect(() => {
    updateDateTime(); // Update date and time on initial render
    const intervalId = setInterval(updateDateTime, 1000); // Update every second

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome back, Admin!
        </h1>

        {/* Display current date and time */}
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
          <p className="text-xl font-semibold">{currentDateTime}</p>
        </div>
      </div>

      {/* Stats Section (Widgets) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white">Total Sales</h3>
          <p className="text-3xl font-bold text-white">$24,500</p>
        </div>
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white">Total Products</h3>
          <p className="text-3xl font-bold text-white">150</p>
        </div>
        <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white">Total Orders</h3>
          <p className="text-3xl font-bold text-white">320</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white">Total Revenue</h3>
          <p className="text-3xl font-bold text-white">$12,500</p>
        </div>
        <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white">Active Users</h3>
          <p className="text-3xl font-bold text-white">1,250</p>
        </div>
        <div className="bg-gradient-to-r from-red-400 to-red-600 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white">Pending Orders</h3>
          <p className="text-3xl font-bold text-white">50</p>
        </div>
      </div>

      {/* Latest Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-xl font-semibold mb-4">Latest Orders</h3>
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4">#12345</td>
              <td className="py-2 px-4">John Doe</td>
              <td className="py-2 px-4">$100</td>
              <td className="py-2 px-4 text-green-600">Completed</td>
              <td className="py-2 px-4">
                <button className="text-blue-500 hover:text-blue-700">
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">#12346</td>
              <td className="py-2 px-4">Jane Smith</td>
              <td className="py-2 px-4">$200</td>
              <td className="py-2 px-4 text-yellow-600">Pending</td>
              <td className="py-2 px-4">
                <button className="text-blue-500 hover:text-blue-700">
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">#12347</td>
              <td className="py-2 px-4">Tom Jones</td>
              <td className="py-2 px-4">$300</td>
              <td className="py-2 px-4 text-red-600">Canceled</td>
              <td className="py-2 px-4">
                <button className="text-blue-500 hover:text-blue-700">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between mt-6">
        <button className="bg-green-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
          Add New Product
        </button>
        <button className="bg-yellow-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-yellow-700 transition duration-300">
          Manage Orders
        </button>
        <button className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
          View Reports
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
