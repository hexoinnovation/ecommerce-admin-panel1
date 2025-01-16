import React, { useState } from "react";

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      name: "Credit Card",
      enabled: true,
      category: "Credit",
      description: "Standard credit card payment.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "PayPal",
      enabled: true,
      category: "Wallet",
      description: "Payment via PayPal account.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: "Bank Transfer",
      enabled: false,
      category: "Bank",
      description: "Direct bank transfer.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [newMethodName, setNewMethodName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRemoving, setIsRemoving] = useState(null);
  const [selectedMethods, setSelectedMethods] = useState([]);

  const togglePaymentMethod = (id) => {
    setPaymentMethods((prevMethods) =>
      prevMethods.map((method) =>
        method.id === id
          ? { ...method, enabled: !method.enabled, updatedAt: new Date() }
          : method
      )
    );
  };

  const addPaymentMethod = () => {
    if (newMethodName) {
      const newMethod = {
        id: paymentMethods.length + 1,
        name: newMethodName,
        enabled: false,
        category: "Credit",
        description: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setPaymentMethods([...paymentMethods, newMethod]);
      setNewMethodName(""); // Clear input field
    }
  };

  const handleRemove = (id) => {
    setIsRemoving(id); // Set id to show confirmation
  };

  const confirmRemove = () => {
    setPaymentMethods(
      paymentMethods.filter((method) => method.id !== isRemoving)
    );
    setIsRemoving(null); // Reset the id after removal
  };

  const cancelRemove = () => {
    setIsRemoving(null); // Cancel removal
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredMethods = paymentMethods.filter((method) =>
    method.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBulkEnable = () => {
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      enabled: true,
      updatedAt: new Date(),
    }));
    setPaymentMethods(updatedMethods);
  };

  const handleBulkDisable = () => {
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      enabled: false,
      updatedAt: new Date(),
    }));
    setPaymentMethods(updatedMethods);
  };

  const handleSelectMethod = (id) => {
    if (selectedMethods.includes(id)) {
      setSelectedMethods(selectedMethods.filter((methodId) => methodId !== id));
    } else {
      setSelectedMethods([...selectedMethods, id]);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Manage Payment Methods
      </h1>

      {/* Search Bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Payment Methods"
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {/* Bulk Enable/Disable */}
        <div className="flex space-x-4">
          <button
            onClick={handleBulkEnable}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Enable Selected
          </button>
          <button
            onClick={handleBulkDisable}
            className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 focus:outline-none"
          >
            Disable Selected
          </button>
        </div>
      </div>

      {/* Grid Layout for Payment Methods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMethods.map((method) => (
          <div
            key={method.id}
            className="flex flex-col bg-white border rounded-lg shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <input
                type="checkbox"
                checked={selectedMethods.includes(method.id)}
                onChange={() => handleSelectMethod(method.id)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <div className="text-xl font-semibold">{method.name}</div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">{method.category}</p>
              <p className="text-sm text-gray-500">{method.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={method.enabled}
                  onChange={() => togglePaymentMethod(method.id)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="text-gray-700">Enabled</span>
              </label>
              <button
                onClick={() => handleRemove(method.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
              >
                Remove
              </button>
            </div>

            <div className="text-xs text-gray-400 mt-4">
              <p>Created At: {method.createdAt.toLocaleDateString()}</p>
              <p>Last Updated: {method.updatedAt.toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Payment Method */}
      <div className="mt-6 flex items-center space-x-4">
        <input
          type="text"
          value={newMethodName}
          onChange={(e) => setNewMethodName(e.target.value)}
          placeholder="Enter new payment method"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-1/2"
        />
        <button
          onClick={addPaymentMethod}
          className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 focus:outline-none"
        >
          Add Payment Method
        </button>
      </div>

      {/* Confirmation Dialog */}
      {isRemoving !== null && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Are you sure you want to remove this payment method?
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={confirmRemove}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Yes, Remove
              </button>
              <button
                onClick={cancelRemove}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
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
