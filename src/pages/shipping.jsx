import React, { useState,useEffect } from 'react';
import { Truck } from "lucide-react"; // Truck icon for shipping
import { motion } from "framer-motion";
import { db } from "../components/firebase"; // Ensure Firebase is properly configured
import {collection,getDocs,addDoc,deleteDoc,doc} from "firebase/firestore";

const ShippingSettings = () => {
  const [shippingMethods, setShippingMethods] = useState([
   
  ]);

  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodRate, setNewMethodRate] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState([]);
  const [regions, setRegions] = useState([
   
  ]);


  
  const [newRegion, setNewRegion] = useState('');
  const [newRegionCost, setNewRegionCost] = useState(0);
  const shippingCollectionRef = collection(db, "admin/nithya123@gmail.com/Shipping");
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




 // Fetch existing shipping regions from Firestore
 useEffect(() => {
  const fetchRegions = async () => {
    const snapshot = await getDocs(shippingCollectionRef);
    const regionList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRegions(regionList);
  };
  fetchRegions();
}, []);

  // Add a new region
  const addRegion = async () => {
    if (!newRegion || !newRegionCost) {
      alert("Please enter both Region Name and Shipping Cost.");
      return;
    }

    try {
      const docRef = await addDoc(shippingCollectionRef, {
        region: newRegion,
        shippingCost: parseFloat(newRegionCost),
      });

      setRegions([...regions, { id: docRef.id, region: newRegion, shippingCost: newRegionCost }]);
      setNewRegion("");
      setNewRegionCost("");
    } catch (error) {
      console.error("Error adding region: ", error);
    }
  };

  // Remove a region
  const removeRegion = async (id) => {
    try {
      await deleteDoc(doc(db, "admin/nithya123@gmail.com/Shipping", id));
      setRegions(regions.filter((region) => region.id !== id));
    } catch (error) {
      console.error("Error removing region: ", error);
    }
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
        <h2 className="text-xl font-semibold mb-4">Shipping state</h2>
      <div className="space-y-4">
        {regions.map((region) => (
          <div
            key={region.id}
            className="flex items-center justify-between bg-white border rounded-lg shadow-sm p-4"
          >
            <div>
              <div className="text-lg font-semibold">{region.region}</div>
              <div className="text-sm text-gray-500">
                Shipping Cost: ₹{region.shippingCost}
              </div>
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
          onChange={(e) => setNewRegionCost(e.target.value)}
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
