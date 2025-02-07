import React, { useState, useEffect } from "react";
import { db } from "../components/firebase"; // Ensure Firebase is properly configured
import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    name: "",
    category: "",
    description: "",
    enabled: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRemoving, setIsRemoving] = useState(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "admin/nithya123@gmail.com/payment")
        );
        const methods = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPaymentMethods(methods);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, []);

  const togglePaymentMethod = async (methodId) => {
    try {
      const updatedMethods = paymentMethods.map((method) =>
        method.id === methodId
          ? { ...method, enabled: !method.enabled }
          : method
      );
      const methodToUpdate = updatedMethods.find(
        (method) => method.id === methodId
      );
      const methodRef = doc(db, "admin/nithya123@gmail.com/payment", methodId);
      await updateDoc(methodRef, {
        enabled: methodToUpdate.enabled,
        updatedAt: new Date().toISOString(),
      });
      setPaymentMethods(updatedMethods);
    } catch (error) {
      console.error("Error updating payment method: ", error);
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!newPayment.name || !newPayment.category) {
      setError("Name and Category are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newMethodRef = doc(
        collection(db, "admin/nithya123@gmail.com/payment")
      );
      const newMethod = {
        ...newPayment,
        id: newMethodRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(newMethodRef, newMethod);
      setPaymentMethods([...paymentMethods, newMethod]);
      setNewPayment({
        name: "",
        category: "",
        description: "",
        enabled: false,
      });
      setShowForm(false);
    } catch (error) {
      setError("Failed to add payment method. Try again.");
      console.error("Error adding payment method: ", error);
    }

    setLoading(false);
  };

  const handleRemove = async (id) => {
    setIsRemoving(id);

    try {
      await deleteDoc(doc(db, "admin/nithya123@gmail.com/payment", id));
      setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
      setIsRemoving(null);
    } catch (error) {
      console.error("Error deleting payment method:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPaymentMethods = paymentMethods.filter((method) =>
    method.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
     
      <div className="flex flex-col justify-center items-center p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-1  ">    Manage Payment Methods</h1>
</div>
      {/* Search Bar */}
      <div className="flex flex-col justify-center items-center p-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Payment Methods"
          className="w-full sm:w-1/2 md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPaymentMethods.map((method) => (
          <div
            key={method.id}
            className="flex flex-col bg-white border rounded-lg shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={method.enabled}
                  onChange={() => togglePaymentMethod(method.id)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="text-gray-700">Enabled</span>
              </label>
              <div className="text-xl font-semibold">{method.name}</div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">{method.category}</p>
              <p className="text-sm text-gray-500">{method.description}</p>
            </div>

            <button
              onClick={() => {
                const isConfirmed = window.confirm(
                  "Are you sure you want to delete this payment method?"
                );
                if (isConfirmed) {
                  handleRemove(method.id);
                }
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
            >
              Remove
            </button>

            <div className="text-xs text-gray-400 mt-4">
              <p>
                Created At:{" "}
                {method.createdAt
                  ? new Date(method.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                Last Updated:{" "}
                {method.updatedAt
                  ? new Date(method.updatedAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 focus:outline-none"
        >
          Add Payment Method
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h2 className="text-xl font-semibold mb-4">
              Add New Payment Method
            </h2>
            <input
              type="text"
              placeholder="Name"
              value={newPayment.name}
              onChange={(e) =>
                setNewPayment({ ...newPayment, name: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Category"
              value={newPayment.category}
              onChange={(e) =>
                setNewPayment({ ...newPayment, category: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              placeholder="Description"
              value={newPayment.description}
              onChange={(e) =>
                setNewPayment({ ...newPayment, description: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            ></textarea>
            <div className="flex space-x-4">
              <button
                onClick={handleAddPaymentMethod}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-400 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
