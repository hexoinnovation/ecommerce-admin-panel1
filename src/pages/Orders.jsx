import React, { useState ,useEffect} from "react";
import { getAuth } from "firebase/auth"; // Import getAuth
import { db} from "../../src/components/firebase"; // Firebase setup file
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
function Orders(order ) {
  const [orders, setOrders] = useState([

  ]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredOrderss, setFilteredOrders] = useState(orders);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);
  
  
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleExportOrders = () => {
    const csvContent = [
      ["Order ID", "Customer", "Total", "Status", "Paid"],
      ...filteredOrders.map((order) => [
        order.id,
        order.fullName,
        order.productName,
        order.totalAmount,
        order.status,
       
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "orders.csv";
    link.click();
  };
  const [highlightedOrderId, setHighlightedOrderId] = useState(null); 
 useEffect(() => {
  }, [highlightedOrderId]); 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const usersCollection = await getDocs(
          collection(db, "admin", "nithya123@gmail.com", "users")
        );
  
        const ordersData = [];
  
        for (const userDoc of usersCollection.docs) {
          const userEmail = userDoc.id; 
  
        
          const ordersSnapshot = await getDocs(
            collection(db, "admin", "nithya123@gmail.com", "users", userEmail, "order")
          );
  
          ordersSnapshot.forEach((doc) => {
            const orderData = doc.data(); 
  
            ordersData.push({
              id: doc.id,
              userEmail, 
              orderType: orderData.orderType || "defaultType", 
              ...orderData, 
            });
          });
        }
  
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        
      }
    };
  
    fetchOrders();
  }, []);

  const handleOrderSelect = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  }; 
  const handleBulkMarkDelivered = async () => {
    try {
      console.log("Selected Orders before update:", selectedOrders); 
  
      if (!selectedOrders || selectedOrders.length === 0) {
        console.error("No orders selected!");
        return;
      }
  
      for (const orderId of selectedOrders) {
        await handleStatusChange(orderId, "Delivered");
      }
  
      setSelectedOrders([]); 
    } catch (error) {
      console.error("Error marking orders as delivered:", error);
    }
  };
  
const handleStatusChange = async (orderId, newStatus) => {
  try {
    console.log("Order ID:", orderId);
    console.log("Filtered Orders:", filteredOrders);

    const order = filteredOrders.find((order) => order.id === orderId);
    console.log("Order found:", order);

    if (!order || !order.userEmail || !order.orderType) {
      console.error("Missing userEmail or orderType in order:", order);
      return;
    }

    const orderRef = doc(
      db, "admin", "nithya123@gmail.com", "users",
      order.userEmail, "order", orderId
    );

    await updateDoc(orderRef, { status: newStatus });

    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
   
  };
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.fullName && order.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.userEmail && order.userEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-6 p-4 ml-10 mb-4">
    {/* Header */}
    <div className="flex flex-col justify-center items-center p-6">
      <motion.div
        initial={{ scale: 0.8, rotate: 0, opacity: 0 }}
        animate={{ scale: 1, rotate: 360, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <ShoppingCart size={48} className="text-blue-700" />
      </motion.div>
      <h1 className="text-4xl font-bold text-blue-700 mt-2">Orders</h1>
    </div>
  
    {/* Filters and Actions */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search by customer"
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border border-indigo-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
        />
        <button
          onClick={handleClearSearch}
          className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 w-full sm:w-auto"
        >
          Clear Search
        </button>
        <button
          onClick={() => handleStatusFilter("")}
          className="p-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 w-full sm:w-auto"
        >
          All
        </button>
        <button
          onClick={() => handleStatusFilter("Shipped")}
          className="p-2 bg-yellow-400 text-yellow-700 rounded-lg hover:bg-yellow-500 w-full sm:w-auto"
        >
          Pending
        </button>
        <button
          onClick={() => handleStatusFilter("Shipped")}
          className="p-2 bg-green-400 text-green-700 rounded-lg hover:bg-green-500 w-full sm:w-auto"
        >
          Shipped
        </button>
        <button
          onClick={() => handleStatusFilter("Delivered")}
          className="p-2 bg-blue-400 text-blue-700 rounded-lg hover:bg-blue-500 w-full sm:w-auto"
        >
          Delivered
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleExportOrders}
          className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 w-full sm:w-auto"
        >
          Export Orders
        </button>
        <button
          onClick={() => handleStatusFilter("Delivered")}
          className="p-2 bg-green-400 text-green-700 rounded-lg hover:bg-green-500 w-full sm:w-auto"
        >
          Show Paid
        </button>
        <button
          onClick={() => handleStatusFilter("Shipped")}
          className="p-2 bg-red-400 text-red-700 rounded-lg hover:bg-red-500 w-full sm:w-auto"
        >
          Show Unpaid
        </button>
      </div>
    </div>
  
    {/* Orders Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {filteredOrders.map((order) => (
        <div
          key={order.id}
          className="border rounded-lg p-4 shadow-lg hover:shadow-2xl transition duration-300 bg-white"
        >
          <div className="flex items-center space-x-2">
            <input
              className="form-checkbox h-5 w-5 text-indigo-600"
              type="checkbox"
              checked={selectedOrders.includes(order.id)}
              onChange={() => handleOrderSelect(order.id)}
            />
            <h3 className="text-lg font-semibold text-indigo-600">
              {order.fullName || order.userEmail}
            </h3>
          </div>
  
          <p className="text-gray-600">
            <strong>Order ID:</strong> #{order.id}
          </p>
  
          <p className="text-gray-600">
            <strong>Order Date:</strong> {new Date(order.timestamp.seconds * 1000).toLocaleString()}
          </p>
  
          <p className="text-l mt-2">
            <strong>Status:</strong>
            <span
              className={`text-${
                order.status === "Shipped"
                  ? "blue"
                  : order.status === "Delivered"
                  ? "green"
                  : "gray"
              }-700 font-bold`}
            >
              {order.status}
            </span>
          </p>
  
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange(order.id, "Shipped")}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full sm:w-auto"
            >
              Mark as Shipped
            </button>
            <button
              onClick={() => handleStatusChange(order.id, "Delivered")}
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full sm:w-auto "
            >
              Mark as Delivered
            </button>
            <button
              onClick={() => handleViewDetails(order)}
              className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 w-full sm:w-auto ml-24"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  
    {/* Bulk Action Button */}
    <div className="mt-4">
      <button
        onClick={handleBulkMarkDelivered}
        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full sm:w-auto"
      >
        Mark Selected Orders as Delivered
      </button>
    </div>
  
    {/* Order Details Modal */}
    {selectedOrder && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 overflow-y-auto p-4">
        <div className="bg-white shadow-xl p-6 rounded-lg max-w-3xl w-full space-y-4 overflow-y-auto max-h-screen">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-indigo-700">
              Invoice #{selectedOrder.id}
            </h2>
            <button
              onClick={handleCloseModal}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Customer Details</h3>
            <p><strong>Name:</strong> {selectedOrder.name}</p>
            <p><strong>Email:</strong> {selectedOrder.email}</p>
            <p><strong>Phone:</strong> {selectedOrder.phone}</p>
            <p><strong>Address:</strong> {selectedOrder.address}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-3 border">Product Name</th>
                  <th className="py-2 px-3 border">Quantity</th>
                  <th className="py-2 px-3 border">Price</th>
                  <th className="py-2 px-3 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.cartItems?.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-full"
                          />
                        ) : (
                          <span>No image</span>
                        )}
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 border">{item.quantity}</td>
                    <td className="py-2 px-4 border">₹ {item.price}</td>
                    <td className="py-2 px-4 border">
                      ₹ {item.quantity * parseFloat(item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Payment Details</h3>
            <table className="w-full border text-sm">
              <tbody>
                <tr>
                  <td className="py-2 px-3 border">Subtotal</td>
                  <td className="py-2 px-3 border">₹ {selectedOrder.subtotal}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-2 px-3 border">Discount</td>
                  <td className="py-2 px-3 border">₹ {selectedOrder.discount}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border">Shipping Charge</td>
                  <td className="py-2 px-3 border">₹ {selectedOrder.shippingCharge}</td>
                </tr>
                <tr className="font-bold">
                  <td className="py-2 px-3 border">Total Amount</td>
                  <td className="py-2 px-3 border">₹ {selectedOrder.grandTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}

export default Orders;
