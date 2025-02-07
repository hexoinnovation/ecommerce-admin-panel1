import React, { useState } from 'react';
import { Truck } from "lucide-react"; // Truck icon for shipping
import { motion } from "framer-motion";

const ShippingSettings = () => {
  const [shippingMethods, setShippingMethods] = useState([
    { id: 1, name: 'Flat Rate', rate: 100, enabled: true },
    { id: 2, name: 'Free Shipping', rate: 0, enabled: true },
    { id: 3, name: 'Carrier: India Post', rate: 150, enabled: false },
  ]);

  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodRate, setNewMethodRate] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState([]);
  const [regions, setRegions] = useState([
    { id: 1, region: 'Delhi', shippingCost: 50 },
    { id: 2, region: 'Mumbai', shippingCost: 100 },
    { id: 3, region: 'Bengaluru', shippingCost: 75 },
  ]);


  
  const [newRegion, setNewRegion] = useState('');
  const [newRegionCost, setNewRegionCost] = useState(0);

  const toggleShippingMethod = (id) => {
    setShippingMethods((prevMethods) =>
      prevMethods.map((method) =>
        method.id === id
          ? { ...method, enabled: !method.enabled }
          : method
      )
    );
  };

  const addShippingMethod = () => {
    if (newMethodName && newMethodRate >= 0) {
      const newMethod = {
        id: shippingMethods.length + 1,
        name: newMethodName,
        rate: newMethodRate,
        enabled: false,
      };
      setShippingMethods([...shippingMethods, newMethod]);
      setNewMethodName('');
      setNewMethodRate(0);
    }
  };

  const removeShippingMethod = (id) => {
    setShippingMethods(shippingMethods.filter((method) => method.id !== id));
  };

  const handleSelectMethod = (id) => {
    if (selectedMethod.includes(id)) {
      setSelectedMethod(selectedMethod.filter((methodId) => methodId !== id));
    } else {
      setSelectedMethod([...selectedMethod, id]);
    }
  };

  const addRegion = () => {
    if (newRegion && newRegionCost >= 0) {
      const newRegionObj = {
        id: regions.length + 1,
        region: newRegion,
        shippingCost: newRegionCost,
      };
      setRegions([...regions, newRegionObj]);
      setNewRegion('');
      setNewRegionCost(0);
    }
  };

  const removeRegion = (id) => {
    setRegions(regions.filter((region) => region.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
 
 <div className="flex flex-col justify-center items-center p-6">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <Truck size={48} className="text-blue-700" />
      </motion.div>
      <h1 className="text-4xl font-bold text-blue-700 mt-2">Shipping Settings</h1>
    </div>
      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Shipping Methods */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Methods</h2>
          <div className="space-y-4">
            {shippingMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between bg-white border rounded-lg shadow-sm p-4"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedMethod.includes(method.id)}
                    onChange={() => handleSelectMethod(method.id)}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                  <div className="ml-4">
                    <div className="text-lg font-semibold">{method.name}</div>
                    <div className="text-sm text-gray-500">Rate: ₹{method.rate}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={method.enabled}
                      onChange={() => toggleShippingMethod(method.id)}
                      className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                    <span className="text-gray-700">Enabled</span>
                  </label>
                  <button
                    onClick={() => removeShippingMethod(method.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Shipping Method */}
          <div className="mt-6 flex items-center space-x-4">
            <input
              type="text"
              value={newMethodName}
              onChange={(e) => setNewMethodName(e.target.value)}
              placeholder="New Shipping Method"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
            <input
              type="number"
              value={newMethodRate}
              onChange={(e) => setNewMethodRate(parseFloat(e.target.value))}
              placeholder="Rate (₹)"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-32"
            />
            <button
              onClick={addShippingMethod}
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 focus:outline-none"
            >
              Add Method
            </button>
          </div>
        </div>

        {/* Right Column - Shipping Regions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Regions</h2>
          <div className="space-y-4">
            {regions.map((region) => (
              <div
                key={region.id}
                className="flex items-center justify-between bg-white border rounded-lg shadow-sm p-4"
              >
                <div>
                  <div className="text-lg font-semibold">{region.region}</div>
                  <div className="text-sm text-gray-500">Shipping Cost: ₹{region.shippingCost}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => removeRegion(region.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Region */}
          <div className="mt-6 flex items-center space-x-4">
            <input
              type="text"
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              placeholder="Region Name (e.g. Delhi)"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
            <input
              type="number"
              value={newRegionCost}
              onChange={(e) => setNewRegionCost(parseFloat(e.target.value))}
              placeholder="Shipping Cost (₹)"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-32"
            />
            <button
              onClick={addRegion}
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 focus:outline-none"
            >
              Add Region
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingSettings;
