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
function Orders(order ) {
  const [orders, setOrders] = useState([

  ]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("");
  const [filteredPaidStatus, setFilteredPaidStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState(order.status);
  const [statusFilter, setStatusFilter] = useState("");

  const [filteredOrderss, setFilteredOrders] = useState(orders);
  const [filter, setFilter] = useState(""); 

  const handlePaidStatusFilter = (status) => {
    setFilter(status);

    if (status === "Paid") {
      const paidOrders = orders.filter((order) => order.status === "Delivered");
      console.log("Paid Orders:", paidOrders);
      setFilteredOrders(paidOrders);
    } else if (status === "Unpaid") {
      const unpaidOrders = orders.filter((order) => order.status !== "Delivered");
      console.log("Unpaid Orders:", unpaidOrders);
      setFilteredOrders(unpaidOrders);
    } else {
      setFilteredOrders(orders);
    }
  };

  useEffect(() => {
    // Set all orders as default on mount
    setFilteredOrders(orders);
  }, [orders]);
  
  
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleBulkMarkPaid = () => {
    setOrders(
      orders.map((order) =>
        selectedOrders.includes(order.id) ? { ...order, paid: true } : order
      )
    );
    setSelectedOrders([]); 
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

  const handleNotificationClick = (orderId) => {
    console.log("Notification clicked, highlightedOrderId:", orderId);
    setHighlightedOrderId(orderId);  
  };
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);
  
  if (loading) {
    return <p className="text-center text-gray-600">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-center text-gray-600">No orders found.</p>;
  }
 ;

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
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-indigo-600">Orders</h1>

      {/* Search and Filter Controls */}
      <div className="flex justify-between items-center space-x-4 mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search by customer"
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 border border-indigo-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleClearSearch}
            className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Clear Search
          </button>
          <button
            onClick={() => handleStatusFilter("")}
            className="p-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
          >
            All
          </button>
          <button
            onClick={() => handleStatusFilter("Shipped")}
            className="p-2 bg-yellow-400 text-yellow-700 rounded-lg hover:bg-yellow-500"
          >
            Pending
          </button>
          <button
            onClick={() => handleStatusFilter("Shipped")}
            className="p-2 bg-green-400 text-green-700 rounded-lg hover:bg-green-500"
          >
            Shipped
          </button>
          <button
            onClick={() => handleStatusFilter("Delivered")}
            className="p-2 bg-blue-400 text-blue-700 rounded-lg hover:bg-blue-500"
          >
            Delivered
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleExportOrders}
            className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Export Orders
          </button>
          <button
  onClick={() => handleStatusFilter("Delivered")}
  className="p-2 bg-green-400 text-green-700 rounded-lg hover:bg-green-500"
>
  Show Paid
</button>
<button
  onClick={() => handleStatusFilter("Shipped")}
  className="p-2 bg-red-400 text-red-700 rounded-lg hover:bg-red-500"
>
  Show Unpaid
</button>

        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {filteredOrders.map((order) => {
        const isHighlighted = String(highlightedOrderId) === String(order.id);
       

        return (
          <div
            key={order.id}
            className={`border rounded-lg p-6 shadow-lg hover:shadow-2xl transition duration-300 ${
              isHighlighted
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white"
                : "bg-white"
            }`}
          >
      
        <div className="flex items-center space-x-2">
        <input 
     className="form-checkbox h-5 w-5 text-indigo-600"
  type="checkbox" 
  checked={selectedOrders.includes(order.id)} 
  onChange={() => handleOrderSelect(order.id)}
/>

          <h3 className="text-xl font-semibold text-indigo-600">
            {order.fullName || order.userEmail}
          </h3>
        </div>
        <p className="text-gray-600">
          <strong>Order ID:</strong> {order.id}
        </p>
        {/* <p className="text-gray-600">
          <strong>Product Details:</strong> {order.productName || "N/A"}
        </p> */}
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
        <div className="mt-4 space-x-2">
          <button
            onClick={() => handleStatusChange(order.id, "Shipped")}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Mark as Shipped
          </button>
          <button
            onClick={() => handleStatusChange(order.id, "Delivered")}
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Mark as Delivered
          </button>
          <button
            onClick={() => handleViewDetails(order)}
            className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            View Details
          </button>
        </div>
      </div>
    );
  })}
</div>

<div className="mt-4">
  <button
    onClick={handleBulkMarkDelivered}
    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
  >
    Mark Selected Orders as Delivered
  </button>
</div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 verflow-y-auto">
          <div className="bg-white shadow-xl p-7 rounded-lg max-w-3xl w-full space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-2xl font-semibold text-indigo-700">
                Invoice #{selectedOrder.id}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>

            {/* Customer Details */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">Customer Details</h3>
              <p><strong>Name:</strong> {selectedOrder.name}</p>
              <p><strong>Email:</strong> {selectedOrder.email}</p>
              <p><strong>Phone:</strong> {selectedOrder.phone}</p>
              <p><strong>Address:</strong> {selectedOrder.address}</p>
            </div>

            {/* Order Summary */}
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

            {/* Payment Details */}
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
