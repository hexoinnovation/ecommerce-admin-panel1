// src/components/Vendors.jsx
import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv"; // For exporting CSV
import { FaPlusCircle, FaEdit, FaTrashAlt, FaFileExport } from "react-icons/fa"; // Icons for actions
import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { useAuth } from "./auth"; 

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [vendorData, setVendorData] = useState({ name: "", email: "", phone: "", address: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVendorId, setEditVendorId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { currentUser } = useAuth(); // Get the authenticated user

  useEffect(() => {
    if (currentUser) {
      fetchVendors();
    }
  }, [currentUser]);

  // Fetch Vendors from Firebase
  const fetchVendors = async () => {
    if (!currentUser) return;

    try {
      const emailPath = currentUser.email.replace(/\./g, "_");
      const vendorCollection = collection(db, `admin/${emailPath}/Vendors`);
      const querySnapshot = await getDocs(vendorCollection);
      const vendorList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVendors(vendorList);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  // Add Vendor
  const handleAddVendor = async () => {
    if (!currentUser) return;

    try {
      const emailPath = currentUser.email.replace(/\./g, "_");
      const vendorCollection = collection(db, `admin/${emailPath}/Vendors`);
      await addDoc(vendorCollection, vendorData);
      setIsModalOpen(false);
      fetchVendors();
    } catch (error) {
      console.error("Error adding vendor:", error);
    }
  };

  // Edit Vendor
  const handleEditVendor = async () => {
    if (!currentUser) return;

    try {
      const emailPath = currentUser.email.replace(/\./g, "_");
      const vendorRef = doc(db, `admin/${emailPath}/Vendors/${editVendorId}`);
      await updateDoc(vendorRef, vendorData);
      setIsModalOpen(false);
      fetchVendors();
    } catch (error) {
      console.error("Error updating vendor:", error);
    }
  };

  // Delete Vendor
  const handleDeleteVendor = async (vendorId) => {
    if (!currentUser) return;

    try {
      const emailPath = currentUser.email.replace(/\./g, "_");
      const vendorRef = doc(db, `admin/${emailPath}/Vendors/${vendorId}`);
      await deleteDoc(vendorRef);
      fetchVendors();
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  // Remaining methods for handling input, search, pagination, etc., are unchanged
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
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

  const indexOfLastVendor = currentPage * itemsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - itemsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(currentPage - 1);

  if (!currentUser) {
    return <div className="text-red-500">Error: User not authenticated</div>;
  }

  const handleBulkDelete = () => {
    selectedVendors.forEach(async (vendorId) => {
      await handleDeleteVendor(vendorId);
    });
    setSelectedVendors([]);
  };

 

  const handleVendorSelection = (vendorId) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]
    );
  };
  if (!currentUser) {
    return <div className="text-red-500">Error: User not authenticated</div>;
  }

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
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FaPlusCircle className="mr-2" />
          Add New Vendor
        </button>

        <CSVLink
          data={vendors}
          filename={"vendors.csv"}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center"
        >
          <FaFileExport className="mr-2" />
          Export Data
        </CSVLink>
      </div>

      {/* Bulk Delete */}
      {selectedVendors.length > 0 && (
        <button
          onClick={handleBulkDelete}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
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
                  setSelectedVendors(e.target.checked ? vendors.map((v) => v.id) : []);
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
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`py-2 px-4 rounded-lg ${
            currentPage === 1 ? "bg-gray-300 text-gray-600" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {Math.ceil(filteredVendors.length / itemsPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={indexOfLastVendor >= filteredVendors.length}
          className={`py-2 px-4 rounded-lg ${
            indexOfLastVendor >= filteredVendors.length
              ? "bg-gray-300 text-gray-600"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>

      {/* Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">
              {editVendorId ? "Edit Vendor" : "Add Vendor"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editVendorId ? handleEditVendor() : handleAddVendor();
              }}
            >
              <input
                type="text"
                name="name"
                value={vendorData.name}
                onChange={handleInputChange}
                placeholder="Vendor Name"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                required
              />
              <input
                type="email"
                name="email"
                value={vendorData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                required
              />
              <input
                type="text"
                name="phone"
                value={vendorData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                required
              />
              <textarea
                name="address"
                value={vendorData.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                rows="3"
              ></textarea>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  {editVendorId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vendors;