import React, { useState } from "react";

// Helper function to simulate export functionality
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

  const customerData = [
    { customerName: "John Doe", orders: 5, totalSpent: 300 },
    { customerName: "Jane Smith", orders: 3, totalSpent: 150 },
    { customerName: "Michael Brown", orders: 8, totalSpent: 500 },
  ];

  const productData = [
    { productName: "Laptop", sold: 30, revenue: 15000 },
    { productName: "Phone", sold: 40, revenue: 20000 },
    { productName: "Tablet", sold: 20, revenue: 10000 },
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

  const renderSalesReport = () => (
    <div className="overflow-x-auto bg-white shadow-xl rounded-lg p-4">
      <table className="min-w-full table-auto border-separate border-spacing-0">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
              Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
              Sales (₹)
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
              Orders
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredSalesData.map((data, index) => (
            <tr
              key={index}
              className={`hover:bg-gray-50 ${
                index % 2 === 0 ? "bg-gray-100" : ""
              }`}
            >
              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                {data.date}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                {data.sales}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                {data.orders}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCustomerReport = () => (
    <div className="overflow-x-auto bg-white shadow-xl rounded-lg p-4">
      <table className="min-w-full table-auto border-separate border-spacing-0">
        <thead className="bg-green-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
              Customer Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
              Orders
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
              Total Spent (₹)
            </th>
          </tr>
        </thead>
        <tbody>
          {customerData.map((data, index) => (
            <tr
              key={index}
              className={`hover:bg-gray-50 ${
                index % 2 === 0 ? "bg-gray-100" : ""
              }`}
            >
              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                {data.customerName}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                {data.orders}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                {data.totalSpent}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderProductReport = () => (
    <div className="overflow-x-auto bg-white shadow-xl rounded-lg p-4">
      <table className="min-w-full table-auto border-separate border-spacing-0">
        <thead className="bg-yellow-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
              Product Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
              Units Sold
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">
              Revenue (₹)
            </th>
          </tr>
        </thead>
        <tbody>
          {productData.map((data, index) => (
            <tr
              key={index}
              className={`hover:bg-gray-50 ${
                index % 2 === 0 ? "bg-gray-100" : ""
              }`}
            >
              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                {data.productName}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                {data.sold}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 border-b">
                {data.revenue}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports</h1>

      {/* Report Filters (e.g., Date Range, Report Type) */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setSelectedReport(e.target.value)}
            value={selectedReport}
          >
            <option value="sales">Sales Report</option>
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
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
      {selectedReport === "sales" && renderSalesReport()}
      {selectedReport === "customers" && renderCustomerReport()}
      {selectedReport === "products" && renderProductReport()}
    </div>
  );
};

export default ReportsPage;
