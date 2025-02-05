import React, { useState } from "react";
import { Link } from "react-router-dom"; // Use Link for navigation
import { IoClose } from "react-icons/io5"; // Import Close icon from react-icons
import { FaCog ,FaTimes,FaBars} from "react-icons/fa"; // Import settings icon for "Choose Layout"


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
 
  //const sidebarColor = "#1E293B"; // Dark color for sidebar background

  return (
        <div  className="min-h-screen" >
           <div className="relative flex">
      <button onClick={toggleSidebar} className="absolute left-2 top-3 z-50 text-white p-2 rounded bg-indigo-700 hover:bg-indigo-600">
        {isSidebarOpen ? <FaBars size={24} /> : <FaBars size={24} />}
      </button>
      <div className={`min-h-screen transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "w-52 p-4" : "w-0 overflow-hidden hidden "}`} style={{ backgroundColor: sidebarColor }}>

        {isSidebarOpen && (
          <h2 className="text-1xl font-semibold text-white transition-all duration-300 mt-20">
            E-Com Admin Panel
          </h2>
        )}
        <ul className="space-y-4 mt-7 flex flex-col items-start">
          {[
            { to: "/", text: "Dashboard" },
            { to: "/products", text: "Products" },
            { to: "/orders", text: "Orders" },
            { to: "/customers", text: "Customers" },
            { to: "/categories", text: "Categories" },
            { to: "/coupons", text: "Coupons" },
            { to: "/vendors", text: "Vendors" },
            { to: "/shipping", text: "Shipping Methods" },
            { to: "/payments", text: "Payment Methods" },
            { to: "/reports", text: "Reports" },
          ].map((item, index) => (
            <li key={index} className="w-full">
              <Link to={item.to} className={`text-white hover:bg-indigo-600 p-2 rounded-lg transition text-1xl duration-200 ease-in-out block ${isSidebarOpen ? "pl-2" : "text-center"}`}>
                {isSidebarOpen ? item.text : item.text.charAt(0)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Profile Settings Button */}
        {isSidebarOpen && (
          <div className="mt-4">
            <Link to="/profile" className="bg-red-600 text-white font-bold text-1xl py-2 px-6 rounded hover:bg-red-700 block text-center">
              Profile Settings
            </Link>
          </div>
        )}

        {/* Logout Button */}
        {isSidebarOpen && (
          <div className="mt-4">
            <button onClick={handleLogout} className="bg-red-600 text-white font-bold text-1xl py-2 px-4 rounded w-full hover:bg-red-700">
              Logout
            </button>
          </div>
        )}

        {/* Choose Layout Button */}
        {isSidebarOpen && (
          <div className="mt-6 flex justify-center">
            <button onClick={toggleModal} className="bg-purple-700 text-white p-3 rounded-full focus:outline-none hover:bg-purple-600 transition duration-200 ease-in-out" aria-label="Choose Layout">
              <FaCog size={24} />
            </button>
          </div>
        )}
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
                onClick={(e) => e.stopPropagation()}
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
                  {[
                    { layout: "professional", color: "indigo" },
                    { layout: "modern", color: "pink" },
                    { layout: "dark", color: "indigo" },
                    { layout: "vibrant", color: "orange" },
                    { layout: "elegant", color: "purple" },
                  ].map((item, index) => (
                    <li key={index}>
                      <button
                        onClick={() => {
                          changeLayout(item.layout);
                          toggleModal();
                        }}
                        className={`block w-full text-left py-2 px-4 hover:bg-${item.color}-600`}
                      >
                        {item.layout.charAt(0).toUpperCase() + item.layout.slice(1)}{" "}
                        Layout
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      );
    };
    
 
export default Sidebar;
