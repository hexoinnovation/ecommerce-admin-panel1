import React, { useState,useEffect  } from "react";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import { FaEdit, FaTrashAlt, FaPlusCircle, FaFileExcel } from "react-icons/fa"; // Icons for actions
import { collection, addDoc,getDocs,doc,getDoc,updateDoc,deleteDoc} from "firebase/firestore";
import { db } from "../components/firebase";
import * as XLSX from "xlsx"; // Library to export Excel file
import { getAuth } from "firebase/auth"; // Import Firebase Auth

function Customers() {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "123-456-7890",
      address: "123 Main St, City, Country",
      orders: 5,
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phoneNumber: "987-654-3210",
      address: "456 Elm St, City, Country",
      orders: 3,
      status: "Inactive",
    },
    {
      id: 3,
      name: "Mark Lee",
      email: "mark@example.com",
      phoneNumber: "555-666-7777",
      address: "789 Oak St, City, Country",
      orders: 4,
      status: "Active",
    },
    // Additional customers
  ]);

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
    // Fallbacks for missing or undefined properties
    const name = customer?.name || "";
    const email = customer?.email || "";
    const phoneNumber = customer?.phoneNumber || "";
    const searchValue = searchQuery?.toLowerCase() || ""; // Assuming searchQuery is your term for searching
  
    // Filtering logic
    return (
      (name.toLowerCase().includes(searchValue) || 
       email.toLowerCase().includes(searchValue) || 
       phoneNumber.includes(searchQuery)) && // Phone number is assumed to be numeric and doesn't need `.toLowerCase()`
      (statusFilter ? customer.status === statusFilter : true) // Apply statusFilter if it's provided
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
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      orders: 0,
      status: "Active",
    });
  };

  const handleSave = () => {
    if (isAdding) {
      setCustomers([...customers, currentCustomer]);
      setMessage("Customer added successfully!");
    } else {
      setCustomers(
        customers.map((customer) =>
          customer.id === currentCustomer.id ? currentCustomer : customer
        )
      );
      setMessage("Customer details updated successfully!");
    }
    setIsEditing(false);
    setIsAdding(false);
    setCurrentCustomer(null);
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

  const [searchTerm, setSearchTerm] = useState("");
  
  const fetchCustomers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const customersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        name: doc.data().name || "Unknown", // Default name if missing
      }));
      setCustomers(customersData);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  

  

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-800 text-center">
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
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter("Active")}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Active
        </button>
        <button
          onClick={() => setStatusFilter("Inactive")}
          className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
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
        {/* Export Data as CSV */}
        <CSVLink
          data={customers}
          filename="customers_data.csv"
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          <FaFileExcel className="inline mr-2" />
          Export as CSV
        </CSVLink>

        {/* Export Data as Excel */}
        <button
          onClick={handleExportExcel}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          <FaFileExcel className="inline mr-2" />
          Export as Excel
        </button>

        {/* Add Customer Button */}
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
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
        <button
          onClick={() => handleEdit(customer)}
          className="text-blue-500 hover:text-blue-700"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => handleDelete(customer.id)}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrashAlt />
        </button>
        <button
          onClick={() => handleSendEmail(customer.email)}
          className="text-gray-500 hover:text-gray-700"
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
    </div>
  );
}

export default Customers;