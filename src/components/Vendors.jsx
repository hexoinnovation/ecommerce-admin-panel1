import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv"; // For exporting CSV
import { FaPlusCircle, FaEdit, FaTrashAlt, FaFileExport } from "react-icons/fa"; // Icons for actions
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../components/firebase";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [vendorData, setVendorData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVendorId, setEditVendorId] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const auth = getAuth();
        const userEmail = auth.currentUser ? auth.currentUser.email : null;

        if (!userEmail) {
          console.error("No user is logged in");
          return;
        }

        const vendorCollectionRef = collection(
          db,
          `admin/${userEmail}/vendors`
        );
        const vendorSnapshot = await getDocs(vendorCollectionRef);
        const vendorList = vendorSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setVendors(vendorList);
      } catch (error) {
        console.error("Error fetching vendors: ", error);
      }
    };

    fetchVendors();
  }, []);

  const handleVendorSelection = (id) => {
    setSelectedVendors((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((vendorId) => vendorId !== id)
        : [...prevSelected, id]
    );
  };

  const handleAddVendor = async () => {
    try {
      const auth = getAuth();
      const userEmail = auth.currentUser ? auth.currentUser.email : null;
      if (!userEmail) {
        console.error("No user is logged in");
        return;
      }

      const newVendor = {
        name: vendorData.name,
        email: vendorData.email,
        phone: vendorData.phone,
        address: vendorData.address,
      };

      const vendorCollectionRef = collection(db, `admin/${userEmail}/vendors`);
      await addDoc(vendorCollectionRef, newVendor);

      setVendors([...vendors, newVendor]);
      setVendorData({ name: "", email: "", phone: "", address: "" });
      setIsModalOpen(false);

      console.log("Vendor added successfully!");
    } catch (error) {
      console.error("Error adding vendor: ", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEditVendor = async () => {
    try {
      const vendorToUpdate = vendors.find(
        (vendor) => vendor.id === editVendorId
      );
      const updatedVendor = { ...vendorToUpdate, ...vendorData };

      const vendorDocRef = doc(
        db,
        `admin/${getAuth().currentUser.email}/vendors`,
        editVendorId
      );
      await updateDoc(vendorDocRef, updatedVendor);

      setVendors(
        vendors.map((vendor) =>
          vendor.id === editVendorId ? { ...vendor, ...vendorData } : vendor
        )
      );

      setVendorData({ name: "", email: "", phone: "", address: "" });
      setEditVendorId(null);
      setIsModalOpen(false);

      console.log("Vendor updated successfully!");
    } catch (error) {
      console.error("Error editing vendor: ", error);
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    try {
      const vendorDocRef = doc(
        db,
        `admin/${getAuth().currentUser.email}/vendors`,
        vendorId
      );
      await deleteDoc(vendorDocRef);

      setVendors(vendors.filter((vendor) => vendor.id !== vendorId));

      console.log("Vendor deleted successfully!");
    } catch (error) {
      console.error("Error deleting vendor: ", error);
    }
  };

  const handleBulkDelete = () => {
    setVendors(
      vendors.filter((vendor) => !selectedVendors.includes(vendor.id))
    );
    setSelectedVendors([]);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };

  const indexOfLastVendor = currentPage * itemsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - itemsPerPage;
  const currentVendors = filteredVendors.slice(
    indexOfFirstVendor,
    indexOfLastVendor
  );

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
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center w-full sm:w-auto"
        >
          <FaPlusCircle className="mr-2" />
          Add New Vendor
        </button>

        <CSVLink
          data={vendors}
          filename={"vendors.csv"}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 flex items-center w-full sm:w-auto"
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

      {/* Vendors Layout for Mobile and Desktop */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="flex flex-col bg-white p-4 shadow-md rounded-lg border"
          >
            <div className="flex justify-between items-center mb-4">
              <input
                type="checkbox"
                checked={selectedVendors.includes(vendor.id)}
                onChange={() => handleVendorSelection(vendor.id)}
              />
              <div className="text-xl font-semibold">{vendor.name}</div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Email: {vendor.email}</p>
              <p className="text-sm text-gray-500">Phone: {vendor.phone}</p>
              <p className="text-sm text-gray-500">Address: {vendor.address}</p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setVendorData({
                    name: vendor.name,
                    email: vendor.email,
                    phone: vendor.phone,
                    address: vendor.address,
                  });
                  setEditVendorId(vendor.id);
                  setIsModalOpen(true);
                }}
                className="text-yellow-500 hover:text-yellow-600"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteVendor(vendor.id)}
                className="text-red-600 hover:text-red-700"
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentVendors.length < itemsPerPage}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Next
        </button>
      </div>

      {/* Modal for Adding and Editing Vendor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">
              {editVendorId ? "Edit Vendor" : "Add New Vendor"}
            </h3>
            <input
              type="text"
              name="name"
              value={vendorData.name}
              onChange={(e) =>
                setVendorData({ ...vendorData, name: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter vendor name"
            />
            <input
              type="email"
              name="email"
              value={vendorData.email}
              onChange={(e) =>
                setVendorData({ ...vendorData, email: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter vendor email"
            />
            <input
              type="text"
              name="phone"
              value={vendorData.phone}
              onChange={(e) =>
                setVendorData({ ...vendorData, phone: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter vendor phone"
            />
            <input
              type="text"
              name="address"
              value={vendorData.address}
              onChange={(e) =>
                setVendorData({ ...vendorData, address: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter vendor address"
            />
            <div className="flex justify-between">
              <button
                onClick={editVendorId ? handleEditVendor : handleAddVendor}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                {editVendorId ? "Update Vendor" : "Add Vendor"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vendors;
