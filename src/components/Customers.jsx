import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { FaEdit, FaTrashAlt, FaPlusCircle, FaFileExcel } from "react-icons/fa"; // Icons for actions
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../components/firebase";
import * as XLSX from "xlsx"; // Library to export Excel file
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import Swal from "sweetalert2";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // Filter by Active or Inactive
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(5);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]); // For bulk delete
  const [message, setMessage] = useState(""); // For showing messages like success/failure

  const filteredCustomers = customers.filter((customer) => {
    const name = customer?.name || "";
    const email = customer?.email || "";
    const phone = customer?.phone || "";
    const searchValue = searchQuery?.toLowerCase() || "";

    return (
      (name.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue) ||
        phone.includes(searchQuery)) &&
      (statusFilter ? customer.status === statusFilter : true)
    );
  });

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (customer) => {
    setIsEditing(true);
    setIsAdding(false);
    setCurrentCustomer({ ...customer });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setCurrentCustomer({
      id: null,
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      orders: 0,
      status: "Active",
    });
  };

  const handleSave = async () => {
    try {
      if (isAdding) {
        setCustomers([...customers, currentCustomer]);
        setMessage("Customer added successfully!");

        const docRef = doc(
          db,
          "admin",
          "nithya123@gmail.com",
          "users",
          currentCustomer.id
        );
        await setDoc(docRef, currentCustomer); // Save customer to Firestore
      } else {
        setCustomers(
          customers.map((customer) =>
            customer.id === currentCustomer.id ? currentCustomer : customer
          )
        );
        setMessage("Customer details updated successfully!");

        const docRef = doc(
          db,
          "admin",
          "nithya123@gmail.com",
          "users",
          currentCustomer.id
        );
        await updateDoc(docRef, currentCustomer); // Update customer in Firestore
      }
      setIsEditing(false);
      setIsAdding(false);
      setCurrentCustomer(null);
    } catch (error) {
      console.error("Error saving customer:", error);
      setMessage("Failed to save customer. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCustomer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDelete = (customerId) => {
    setCustomers(customers.filter((customer) => customer.id !== customerId));
    setMessage("Customer deleted successfully!");
  };

  const handleBulkDelete = () => {
    setCustomers(
      customers.filter((customer) => !selectedCustomers.includes(customer.id))
    );
    setMessage("Selected customers deleted successfully!");
    setSelectedCustomers([]);
  };

  const handleSendEmail = (customerEmail) => {
    alert(`Sending email to ${customerEmail}`);
  };

  // Export data as Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(customers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, "customers_data.xlsx");
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "admin", "nithya123@gmail.com", "users")
        );
        const customersData = [];
        querySnapshot.forEach((doc) => {
          customersData.push({ id: doc.id, ...doc.data() });
        });
        setCustomers(customersData);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleSubmitCustomer = async () => {
    try {
      const newCustomer = { ...currentCustomer, id: Date.now().toString() }; // Add an ID for local rendering
      const docRef = doc(
        db,
        "admin",
        "nithya123@gmail.com",
        "users",
        newCustomer.id
      ); // Modify path here
      await setDoc(docRef, newCustomer); // Save customer at the new path

      setCustomers([...customers, newCustomer]);

      setIsAdding(false);

      Swal.fire({
        icon: "success",
        title: "Customer Added",
        text: "New customer has been added successfully!",
      });
    } catch (error) {
      console.error("Error adding customer:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add customer. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-800 text-center">
        Customers Details
      </h1>

      {/* Search Input */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-4 border border-blue-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3"
        />
      </div>

      {/* Status Filter */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => setStatusFilter("")}
          className="bg-blue-600 text-white py-2 px-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter("Active")}
          className="bg-green-600 text-white py-2 px-2 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Active
        </button>
        <button
          onClick={() => setStatusFilter("Inactive")}
          className="bg-gray-600 text-white py-2 px-2 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          Inactive
        </button>
      </div>

      {/* Message Area */}
      {message && (
        <div className="text-center text-green-600 bg-green-100 p-4 rounded-lg">
          {message}
        </div>
      )}

      {/* Export Data Buttons */}
      <div className="flex justify-between mb-4">
        <CSVLink
          data={customers}
          filename="customers_data.csv"
          className="bg-blue-600 text-white py-1 px-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          <FaFileExcel className="inline mr-2" />
          Export as CSV
        </CSVLink>

        <button
          onClick={handleExportExcel}
          className="bg-blue-600 text-white py-1 px-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          <FaFileExcel className="inline mr-2" />
          Export as Excel
        </button>

        <button
          onClick={handleAdd}
          className="bg-green-600 text-white py-1 px-2 rounded-lg hover:bg-green-700 transition duration-300"
        >
          <FaPlusCircle className="inline mr-2" />
          Add Customer
        </button>
      </div>

      {/* Customers Table */}
      <table className="w-full table-auto bg-white shadow-lg rounded-xl">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left">
              <input
                type="checkbox"
                className="rounded"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCustomers(
                      customers.map((customer) => customer.id)
                    );
                  } else {
                    setSelectedCustomers([]);
                  }
                }}
              />
            </th>
            <th className="py-3 px-4 text-left">Customer Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Phone Number</th>
            <th className="py-3 px-4 text-left">Address</th>
            <th className="py-3 px-4 text-left">Orders</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
  {customers.map((customer) => (
    <tr key={customer.id} className="hover:bg-blue-100 transition duration-300">
      <td className="py-2 px-4">
        <input
          type="checkbox"
          checked={selectedCustomers.includes(customer.id)}
          onChange={() => {
            if (selectedCustomers.includes(customer.id)) {
              setSelectedCustomers(selectedCustomers.filter((id) => id !== customer.id));
            } else {
              setSelectedCustomers([...selectedCustomers, customer.id]);
            }
          }}
          className="rounded"
        />
      </td>
      <td className="py-2 px-4">{`${customer.firstName} ${customer.lastName}`}</td>
      <td className="py-2 px-4">{customer.email}</td>
      <td className="py-2 px-4">{customer.phone}</td>
      <td className="py-2 px-4">{customer.address}</td>
      <td className="py-2 px-4">{customer.orders || "N/A"}</td>
      <td className="py-2 px-4 flex space-x-2">
        {/* <button
          onClick={() => handleEdit(customer)}
          className="text-blue-500 hover:text-blue-700"
        >
          <FaEdit />
        </button> */}
        {/* <button
          onClick={() => handleDelete(customer.id)}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrashAlt />
        </button> */}
        <button
          onClick={() => handleSendEmail(customer.email)}
          className="text-gray-500 hover:text-gray-700 py-2 px-2"
        >
          <i className="fas fa-envelope"></i>
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({
          length: Math.ceil(filteredCustomers.length / customersPerPage),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Edit/Add Customer Modal */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              {isAdding ? "Add New Customer" : "Edit Customer"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={currentCustomer.firstName}
                  onChange={handleInputChange}
                  name="firstName"
                  className="border rounded-md w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={currentCustomer.lastName}
                  onChange={handleInputChange}
                  name="lastName"
                  className="border rounded-md w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={currentCustomer.email}
                  onChange={handleInputChange}
                  name="email"
                  className="border rounded-md w-full p-2"
                  disabled={isEditing}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  value={currentCustomer.phone}
                  onChange={handleInputChange}
                  name="phone"
                  className="border rounded-md w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={currentCustomer.address}
                  onChange={handleInputChange}
                  name="address"
                  className="border rounded-md w-full p-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
