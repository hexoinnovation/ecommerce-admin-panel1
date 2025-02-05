import React, { useState } from "react";
import { Link } from "react-router-dom"; // Use Link for navigation
import { IoClose } from "react-icons/io5"; // Import Close icon from react-icons
import { FaCog } from "react-icons/fa"; // Import settings icon for "Choose Layout"

const Sidebar = ({
  setIsAuthenticated,
  sidebarWidth = "250px",
  changeLayout,
  sidebarColor = "#1f2937", // Default dark color for sidebar
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for popup modal visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to toggle sidebar visibility

  // Logout functionality
  const handleLogout = () => {
    setIsAuthenticated(false);
    window.location.href = "/login"; // Redirect to login page
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row overflow-y-auto ${
        isSidebarOpen ? "w-64" : "w-20"
      } transition-all duration-300 ease-in-out`}
      style={{
        backgroundColor: sidebarColor, // Dark color for sidebar background
      }}
    >
      {/* Sidebar Content */}
      <div className="flex flex-col justify-between flex-grow p-6">
        {/* Toggle button for small screen */}
        <div className="lg:hidden flex justify-between items-center mb-6">
          <button
            onClick={toggleSidebar}
            className="text-white p-2 rounded bg-indigo-700 hover:bg-indigo-600"
          >
            {isSidebarOpen ? "Close" : "Open"} Sidebar
          </button>
        </div>

        {/* Sidebar Title */}
        <h2
          className={`text-1xl font-semibold  text-white transition-all duration-300 ${
            isSidebarOpen ? "block" : "hidden"
          }`}
        >
          E-Com Admin Panel
        </h2>

        {/* Sidebar navigation links */}
        <ul className="space-y-6 mt-9 flex flex-col">
          <li>
            <Link
              to="/"
              className="text-white hover:bg-indigo-600 p-3 rounded-lg transition text-1xl duration-200 ease-in-out"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className="text-white hover:bg-indigo-600 p-3 rounded-lg text-1xl transition duration-200 ease-in-out"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/orders"
              className="text-white hover:bg-indigo-600 p-3 text-1xl rounded-lg transition duration-200 ease-in-out"
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              to="/customers"
              className="text-white hover:bg-indigo-600 p-3 text-1xl rounded-lg transition duration-200 ease-in-out"
            >
              Customers
            </Link>
          </li>
          <li>
            <Link
              to="/categories"
              className="text-white hover:bg-indigo-600 text-1xl p-3 rounded-lg transition duration-200 ease-in-out"
            >
              Categories
            </Link>
          </li>
          <li>
            <Link
              to="/coupons"
              className="text-white hover:bg-indigo-600 text-1xl p-3 rounded-lg transition duration-200 ease-in-out"
            >
              Coupons
            </Link>
          </li>
          <li>
            <Link
              to="/vendors"
              className="text-white hover:bg-indigo-600 p-3  text-1xl rounded-lg transition duration-200 ease-in-out"
            >
              Vendors
            </Link>
          </li>

          {/* New sections for Shipping and Payment Methods moved up */}
          <li>
            <Link
              to="/shipping"
              className="text-white hover:bg-indigo-600 p-3 text-1xl rounded-lg transition duration-200 ease-in-out"
            >
              Shipping Methods
            </Link>
          </li>
          <li>
            <Link
              to="/payments"
              className="text-white hover:bg-indigo-600 p-3 text-1xl rounded-lg transition duration-200 ease-in-out"
            >
              Payment Methods
            </Link>
          </li>

          {/* Reports section remains unchanged */}
          <li>
            <Link
              to="/reports"
              className="text-white hover:bg-indigo-600 p-3 text-1xl rounded-lg transition duration-200 ease-in-out"
            >
              Reports
            </Link>
          </li>

          {/* Profile Settings now as button using Link */}
          <li>
            <Link
              to="/profile" // Link to Profile page
              className="mt-4 bg-red-600 text-white font-bold text-1xl py-3 px-11 rounded w-600px hover:bg-red-700"
            >
              Profile Settings
            </Link>
          </li>
        </ul>

        {/* Logout Button with same width and height */}
        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-600 text-white font-bold text-1xl py-3 px-4 rounded w-full hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Choose Layout button with Icon style */}
        <div className="lg:mt-6 mt-4 flex justify-center items-center">
          <button
            onClick={toggleModal}
            className="bg-purple-700 text-white p-3 rounded-full focus:outline-none hover:bg-purple-600 transition duration-200 ease-in-out"
            aria-label="Choose Layout"
          >
            <FaCog size={24} />
          </button>
        </div>
      </div>

      {/* Modal Popup for Layout Selection */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white p-6 rounded-lg w-72 space-y-4"
            onClick={(e) => e.stopPropagation()} // Prevent click propagation to close the modal
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Select a Layout</h3>
              <button
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose size={24} />
              </button>
            </div>
            <ul>
              <li>
                <button
                  onClick={() => {
                    changeLayout("professional");
                    toggleModal();
                  }}
                  className="block w-full text-left py-2 px-4 hover:bg-indigo-600"
                >
                  Professional Layout
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    changeLayout("modern");
                    toggleModal();
                  }}
                  className="block w-full text-left py-2 px-4 hover:bg-pink-600"
                >
                  Modern Layout
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    changeLayout("dark");
                    toggleModal();
                  }}
                  className="block w-full text-left py-2 px-4 hover:bg-indigo-600"
                >
                  Dark Layout
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    changeLayout("vibrant");
                    toggleModal();
                  }}
                  className="block w-full text-left py-2 px-4 hover:bg-orange-600"
                >
                  Vibrant Layout
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    changeLayout("elegant");
                    toggleModal();
                  }}
                  className="block w-full text-left py-2 px-4 hover:bg-purple-600"
                >
                  Elegant Layout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
