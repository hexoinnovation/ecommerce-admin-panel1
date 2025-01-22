// src/components/Vendors.jsx
import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv"; // For exporting CSV
import { FaPlusCircle, FaEdit, FaTrashAlt, FaFileExport } from "react-icons/fa"; // Icons for actions
import { useAuth } from "./AuthContext"; 
import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [vendorData, setVendorData] = useState({ name: "", email: "", phone: "", address: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVendorId, setEditVendorId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { currentUser } = useAuth(); // Using auth from context

  const fetchVendors = async () => {
    if (currentUser) {
      try {
        const querySnapshot = await getDocs(collection(db, `admin/${currentUser.email}/Vendors`));
        const vendorList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVendors(vendorList);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchVendors();
    }
  }, [currentUser]);

  const handleAddVendor = async () => {
    try {
      const vendorRef = doc(db, `admin/${currentUser.email}/Vendors`, vendorData.id);
      await setDoc(vendorRef, vendorData);
      setIsModalOpen(false);
      fetchVendors(); // Refresh vendor list after adding
    } catch (error) {
      console.error("Error adding vendor: ", error);
    }
  };

  const handleEditVendor = async () => {
    try {
      const vendorRef = doc(db, `admin/${currentUser.email}/Vendors/${editVendorId}`);
      await updateDoc(vendorRef, vendorData);
      setIsModalOpen(false);
      fetchVendors(); // Refresh vendor list after editing
    } catch (error) {
      console.error("Error updating vendor: ", error);
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    try {
      const vendorRef = doc(db, `admin/${currentUser.email}/Vendors/${vendorId}`);
      await deleteDoc(vendorRef);
      fetchVendors(); // Refresh vendor list after deleting
    } catch (error) {
      console.error("Error deleting vendor: ", error);
    }
  };

  const handleBulkDelete = () => {
    selectedVendors.forEach(async (vendorId) => {
      await handleDeleteVendor(vendorId);
    });
    setSelectedVendors([]); // Clear selection after bulk deletion
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.phone.includes(searchQuery)
  );

  const handleVendorSelection = (vendorId) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };

  const indexOfLastVendor = currentPage * itemsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - itemsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Vendors</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search vendors by name, email, or phone..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-3 border border-gray-300 rounded-lg mb-6"
      />

      {/* Add Vendor Button and Export Button */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
        >
          <FaPlusCircle className="mr-2" />
          Add New Vendor
        </button>

        <CSVLink
          data={vendors}
          filename={"vendors.csv"}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 flex items-center"
        >
          <FaFileExport className="mr-2" />
          Export Data
        </CSVLink>
      </div>

      {/* Bulk Delete */}
      {selectedVendors.length > 0 && (
        <button
          onClick={handleBulkDelete}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 mb-4"
        >
          Delete Selected Vendors
        </button>
      )}

      {/* Vendors Table */}
      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-indigo-700 text-white">
          <tr>
            <th className="py-3 px-6 text-left">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedVendors(vendors.map((vendor) => vendor.id));
                  } else {
                    setSelectedVendors([]);
                  }
                }}
              />
            </th>
            <th className="py-3 px-6 text-left">Vendor Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Phone</th>
            <th className="py-3 px-6 text-left">Address</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentVendors.map((vendor) => (
            <tr key={vendor.id} className="border-b hover:bg-gray-100">
              <td className="py-3 px-6">
                <input
                  type="checkbox"
                  checked={selectedVendors.includes(vendor.id)}
                  onChange={() => handleVendorSelection(vendor.id)}
                />
              </td>
              <td className="py-3 px-6">{vendor.name}</td>
              <td className="py-3 px-6">{vendor.email}</td>
              <td className="py-3 px-6">{vendor.phone}</td>
              <td className="py-3 px-6">{vendor.address}</td>
              <td className="py-3 px-6">
                <button
                  onClick={() => {
                    setEditVendorId(vendor.id);
                    setVendorData({ ...vendor });
                    setIsModalOpen(true);
                  }}
                  className="text-yellow-500 hover:text-yellow-700 mr-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteVendor(vendor.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
        >
          Prev
        </button>
        <button
          onClick={handleNextPage}
          disabled={indexOfLastVendor >= filteredVendors.length}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Vendors;
