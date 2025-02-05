import React, { useState, useEffect } from "react";
import { collection, addDoc,getDocs,doc,getDoc,setDoc} from "firebase/firestore";
import { db } from "../components/firebase";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";


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

  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      if (!currentUser) {
        alert("No user is currently logged in.");
        return;
      }
  
      const sanitizedEmail = currentUser.email.replace(/\s/g, "_"); // Sanitize email for Firestore path
  
      try {
        // Updated collection path with "admin" and the sanitized user email
        const collectionRef = collection(db, "admin", sanitizedEmail, "products");
  
        // Fetch products from the specified path
        const productSnapshot = await getDocs(collectionRef);
        const productList = productSnapshot.docs.map((doc) => doc.data());
  
        setProducts(productList); // Set products data
        setProductCount(productList.length); // Set the product count
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, []);


  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0); // State for the total count of customers
  const [isAdding, setIsAdding] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({
    id: null,
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    orders: 0,
    status: "Active",
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      if (!currentUser) {
        console.error("No user is currently logged in.");
        return;
      }
  
      // Sanitize the email to use it in the Firestore path
      const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
  
      try {
        // Sanitize the email to use it in the Firestore path
        const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
      
        // Fetch from the 'admin/{sanitizedEmail}/users' collection
        const adminUsersRef = collection(db, "admin", sanitizedEmail, "users");
        const querySnapshotAdminUsers = await getDocs(adminUsersRef);
        const customersData = [];
      
        // Loop through each document in the collection
        querySnapshotAdminUsers.forEach((doc) => {
          customersData.push({ id: doc.id, ...doc.data() });
        });
      
        // Optionally, handle the state update here (example: setting customers)
        setCustomers(customersData);
        setTotalCustomers(customersData.length); // Update total customer count
      
      } catch (error) {
        console.error("Error fetching customers:", error);
        // Handle the error as appropriate (e.g., show an alert)
      }
    };
  
    fetchCustomers();
  }, []); // Empty dependency array ensures this runs only once when component mounts
  

  // const handleSubmitCustomer = async () => {
  //   try {
  //     const newCustomer = { ...currentCustomer, id: Date.now().toString() };
  
  //     // Sanitize the user's email to be used in Firestore path
  //     const userEmail = "nithya123@gmail.com"; // Replace with the actual logged-in user's email if needed
  //     const sanitizedEmail = userEmail.replace(/\s/g, "_");
  
  //     // Modify the docRef to store customer data under the path: admin/{userEmail}/users/{newCustomer.id}
  //     const docRef = doc(db, "admin", sanitizedEmail, "users", newCustomer.id);
  
  //     // Save new customer data in Firestore
  //     await setDoc(docRef, newCustomer);
  
  //     // Update local state and total count
  //     setCustomers([...customers, newCustomer]);
  //     setTotalCustomers(customers.length + 1); // Increment the total count by 1
  
  //     setIsAdding(false);
  
  //     Swal.fire({
  //       icon: "success",
  //       title: "Customer Added",
  //       text: "New customer has been added successfully!",
  //     });
  //   } catch (error) {
  //     console.error("Error adding customer:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Failed to add customer. Please try again.",
  //     });
  //   }
  // };
  
  const navigate = useNavigate();
  
  const handleRedirect = () => {
    navigate('/reports'); // Redirect to /reports page
  };


  const [orders, setOrders] = useState([]);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0); // New state to hold the total orders count

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const usersCollection = await getDocs(
          collection(db, "admin", "nithya123@gmail.com", "users")
        );

        const ordersData = [];
        let totalCount = 0; // Initialize the total count of orders

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

            totalCount++; // Increment the count for each order found
          });
        }

        setOrders(ordersData);
        setTotalOrdersCount(totalCount); // Update the total orders count
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
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
          <p className="text-3xl font-bold text-white">₹24,500</p>
        </div>
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-white">Total Products</h3>
      <p className="text-3xl font-bold text-white">{productCount}</p> {/* Display product count */}
    </div>
    <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-white">Total Orders</h3>
      <p className="text-3xl font-bold text-white">{totalOrdersCount}</p>
    </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white">Total Revenue</h3>
          <p className="text-3xl font-bold text-white">₹12,500</p>
        </div>
        <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-6 rounded-lg shadow-lg">
  <h3 className="text-xl font-semibold text-white">Active Users</h3>
  <p className="text-3xl font-bold text-white">{totalCustomers}</p>
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
              <td className="py-2 px-4">₹100</td>
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
              <td className="py-2 px-4">₹200</td>
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
              <td className="py-2 px-4">₹300</td>
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
        {/* <button className="bg-green-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
          Add New Product
        </button> */}
        {/* <button className="bg-yellow-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-yellow-700 transition duration-300">
          Manage Orders
        </button> */}
         <button
      onClick={handleRedirect}
      className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
    >
      View Reports
    </button>
      </div>
    </div>
  );
}

export default Dashboard;
