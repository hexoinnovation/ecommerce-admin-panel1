import React, { useState,useEffect } from "react";
import {collection,getDocs,} from "firebase/firestore";
import { db } from "../components/firebase";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
// Helper function to simulate export functionality
import { FileText   } from "lucide-react"; // Bar chart icon for reports
import { motion } from "framer-motion";
const exportToCSV = (data, filename = "report.csv") => {
  const csvContent = [
    ["Date", "Sales (₹)", "Orders"], // Header for sales report
    ...data.map((item) => [item.date, item.sales, item.orders]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState("sales");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for the reports
  const salesData = [
    { date: "2025-01-01", sales: 1500, orders: 50 },
    { date: "2025-01-02", sales: 2000, orders: 60 },
    { date: "2025-01-03", sales: 1800, orders: 55 },
    { date: "2025-01-04", sales: 2200, orders: 70 },
  ];


  const handleDateChange = (event) => {
    if (event.target.name === "start") {
      setStartDate(event.target.value);
    } else {
      setEndDate(event.target.value);
    }
  };

  const filterByDateRange = (data) => {
    if (!startDate || !endDate) return data;
    return data.filter(
      (item) =>
        new Date(item.date) >= new Date(startDate) &&
        new Date(item.date) <= new Date(endDate)
    );
  };

  const filteredSalesData = filterByDateRange(salesData).filter((data) =>
    data.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [currentPage,] = useState(1);
  const [itemsPerPage] = useState(10);
  const [vendors, setVendors] = useState([]);
  
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const auth = getAuth();
        const userEmail = auth.currentUser ? auth.currentUser.email : null;
  
        if (!userEmail) {
          console.error("No user is logged in");
          return;
        }
  
        const vendorCollectionRef = collection(db, `admin/${userEmail}/vendors`);
        const vendorSnapshot = await getDocs(vendorCollectionRef);
        const vendorList = vendorSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setVendors(vendorList);
      } catch (error) {
        console.error("Error fetching vendors: ", error);
      }
    };
  
    fetchVendors();
  }, []);
  
  // Filter the vendors based on the search query
  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.phone.includes(searchQuery)
  );
  
  // Pagination logic
  const indexOfLastVendor = currentPage * itemsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - itemsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);
  
  const renderVendorsReport = () => (
    <div className="overflow-x-auto bg-white shadow-xl rounded-lg p-4">
      <table className="min-w-full table-auto border-separate border-spacing-0">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-bold text-black-900 border-b">
              Vendor Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-black-900 border-b">
              Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-black-900 border-b">
              Phone
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-black-900 border-b">
              Address
            </th>
          </tr>
        </thead>
        <tbody>
          {currentVendors.map((vendor, index) => (
            <tr
              key={vendor.id}
              className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-gray-100" : ""}`}
            >
              <td className="px-4 py-2 text-sm text-gray-700 border-b">{vendor.name}</td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">{vendor.email}</td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">{vendor.phone}</td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">{vendor.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );



  const [customers, setCustomers] = useState([]);

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

  const renderCustomerReport = () => (
    <div className="overflow-x-auto bg-white shadow-xl rounded-lg p-4">
      <table className="min-w-full table-auto border-separate border-spacing-0">
      <thead className="bg-green-100">
          <tr>
            <th  className="px-4 py-3 text-left text-sm font-bold text-black-900 border-b ">Customer Name</th>
            <th  className="px-4 py-3 text-left text-sm font-bold text-black-900 border-b">Email</th>
            <th  className="px-4 py-3 text-left text-sm font-bold text-black-900 border-b">Phone Number</th>
            <th  className="px-4 py-3 text-left text-sm font-bold text-black-900 border-b">Address</th>

          </tr>
        </thead>
        <tbody>
  {customers.map((customer) => (
    <tr key={customer.id} className="hover:bg-blue-100 transition duration-300">
      <td className="px-4 py-2 text-sm text-gray-700 border-b">{`${customer.firstName} ${customer.lastName}`}</td>
      <td className="px-4 py-2 text-sm text-gray-700 border-b">{customer.email}</td>
      <td className="px-4 py-2 text-sm text-gray-700 border-b">{customer.phone}</td>
      <td className="px-4 py-2 text-sm text-gray-700 border-b">{customer.address}</td>
    </tr>
  ))}
</tbody>
</table>
    </div>
  );

 const [products, setProducts] = useState([]);
 const [ ,setFilteredProducts] = useState([]);
   const [categoryFilter] = useState(""); // Filter by category
// Fetch products from Firestore
useEffect(() => {
  const fetchProducts = async () => {
    try {
      // Get the current user's email
      const auth = getAuth(); // Initialize Firebase Auth
      const currentUser = auth.currentUser; // Get the currently signed-in user

      if (!currentUser || !currentUser.email) {
        console.error("No user is signed in. Please sign in to view products.");
        return;
      }

      const userEmail = currentUser.email; // Extract the user's email

      // Specify the path to your 'Products' collection
      const productsCollectionRef = collection(
        db,
        "admin",
        userEmail, // Use the current user's email
        "products"
      );

      // Fetch products from Firestore
      const productSnapshot = await getDocs(productsCollectionRef);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id, // Firestore-generated ID
        ...doc.data() // Data from the document
      }));

      setProducts(productList);
      setFilteredProducts(productList); // Set filtered products if needed
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchProducts();
}, []); // Dependency array, no additional dependencies required here

const filteredProducts = products.filter(
  (product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (categoryFilter ? product.category === categoryFilter : true)
);

  const renderProductReport = () => (
    <div className="overflow-x-auto bg-white shadow-xl rounded-lg p-4">
      <table className="min-w-full table-auto border-separate border-spacing-0">
      <thead className="bg-yellow-100">
          <tr>
          <th className="px-4 py-3 text-left text-sm font-bold text-black-900 border-b">
              Image
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-black-900 border-b">
              Product Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-black-900 border-b">
            Price
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-black-900 border-b">
            Discount Price
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-black-900 border-b">
            Stock
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-black-900 border-b">
            Product Availability	
            </th>
          </tr>
        </thead>
        <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                         <td className="py-2 px-3">
              {product.image ? (
                <img
                  src={product.image} 
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-full"
                />
              ) : (
                <span>No image</span>
              )}
            
            </td>
                        <td className="py-2 px-3">{product.name}</td>
                        <td className="py-2 px-3">₹{product.price}</td>
                        <td className="py-2 px-3">₹{product.discountPrice}</td>
                        <td className="py-2 px-3">{product.stock}</td>
                        <td className="py-2 px-3">{product.availability}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-2 px-3 text-center text-gray-500"
                      >
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
    <div className="flex flex-col justify-center items-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <FileText   size={48} className="text-blue-700" />
      </motion.div>
      <h1 className="text-4xl font-bold text-blue-700 mt-2">Reports</h1>
    </div>
      {/* Report Filters (e.g., Date Range, Report Type) */}
      <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
            onChange={(e) => setSelectedReport(e.target.value)}
            value={selectedReport}
          >
            <option value="sales">Vendors Report</option>
            <option value="customers">Customer Report</option>
            <option value="products">Product Report</option>
          </select>

          {/* Date Range Picker */}
          <div className="flex space-x-4">
            <input
              type="date"
              name="start"
              value={startDate}
              onChange={handleDateChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              name="end"
              value={endDate}
              onChange={handleDateChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by Date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Filter Button */}
          <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none">
            Filter
          </button>

          {/* Export Button */}
          <button
            onClick={() => exportToCSV(filteredSalesData)}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 focus:outline-none"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Report Tables */}
      {selectedReport === "sales" && renderVendorsReport()}
      {selectedReport === "customers" && renderCustomerReport()}
      {selectedReport === "products" && renderProductReport()}
    </div>
  );
};

export default ReportsPage;