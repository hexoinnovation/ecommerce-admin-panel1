import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaEdit, FaPlusCircle } from "react-icons/fa"; // Icons for actions
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [newCoupon, setNewCoupon] = useState({ code: "", discount: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 5;

  // Fetch coupons from Firestore
  const fetchCoupons = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser || !currentUser.email) {
        console.error("No user is signed in. Unable to fetch coupons.");
        return;
      }

      const userEmail = currentUser.email;
      const collectionRef = collection(
        db,
        "admin",
        userEmail,
        "Coupons & Discounts"
      );
      const querySnapshot = await getDocs(collectionRef);

      const couponsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCoupons(couponsData);
    } catch (error) {
      console.error("Error fetching coupons: ", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleAddCoupon = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser || !currentUser.email) {
        alert("No user is signed in. Please sign in to add a coupon.");
        return;
      }

      const userEmail = currentUser.email;
      const collectionRef = collection(
        db,
        "admin",
        userEmail,
        "Coupons & Discounts"
      );

      const docRef = await addDoc(collectionRef, newCoupon);

      setCoupons([...coupons, { ...newCoupon, id: docRef.id }]);
      setNewCoupon({ code: "", discount: "" });
      alert("Coupon added successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding coupon:", error);
      alert("Failed to add coupon. Please try again.");
    }
  };

  const handleEditCoupon = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser || !currentUser.email) {
        alert("No user is signed in. Please sign in to edit a coupon.");
        return;
      }

      const userEmail = currentUser.email;
      const docRef = doc(
        db,
        "admin",
        userEmail,
        "Coupons & Discounts",
        selectedCoupon.id
      );

      await updateDoc(docRef, selectedCoupon);

      setCoupons(
        coupons.map((coupon) =>
          coupon.id === selectedCoupon.id ? selectedCoupon : coupon
        )
      );
      setSelectedCoupon(null);
      alert("Coupon updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error editing coupon:", error);
      alert("Failed to update coupon. Please try again.");
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser || !currentUser.email) {
        alert("No user is signed in. Please sign in to delete a coupon.");
        return;
      }

      const userEmail = currentUser.email;
      const docRef = doc(
        db,
        "admin",
        userEmail,
        "Coupons & Discounts",
        couponId
      );

      await deleteDoc(docRef);

      setCoupons(coupons.filter((coupon) => coupon.id !== couponId));

      alert("Coupon deleted successfully!");
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert("Failed to delete coupon. Please try again.");
    }
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredCoupons.length / couponsPerPage);
  const currentCoupons = filteredCoupons.slice(
    (currentPage - 1) * couponsPerPage,
    currentPage * couponsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 p-6">
    
      <div className="flex flex-col justify-center items-center p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-1  ">   Coupons & Discounts</h1>
</div>
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by coupon code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Add New Coupon Button */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white py-2 px-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center"
        >
          <FaPlusCircle className="mr-2" />
          Add New Coupon
        </button>

        {/* Export Data Button */}
        <button className="bg-blue-600 text-white py-2 px-2 rounded-lg hover:bg-blue-700 transition duration-200">
          Export Coupons
        </button>
      </div>

      {/* Coupons Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto text-center sm:text-left">
          <thead className="bg-indigo-700 text-white">
            <tr>
              <th className="py-3 px-6 text-sm">Coupon Code</th>
              <th className="py-3 px-6 text-sm">Discount (%)</th>
              <th className="py-3 px-6 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCoupons.map((coupon) => (
              <tr key={coupon.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{coupon.code}</td>
                <td className="py-3 px-6">{coupon.discount}%</td>
                <td className="py-3 px-6 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedCoupon(coupon);
                      setIsModalOpen(true);
                    }}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-200"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-200"
        >
          Next
        </button>
      </div>

      {/* Modal for Add/Edit Coupon */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">
              {selectedCoupon ? "Edit Coupon" : "Add New Coupon"}
            </h3>
            <input
              type="text"
              value={selectedCoupon ? selectedCoupon.code : newCoupon.code}
              onChange={(e) =>
                selectedCoupon
                  ? setSelectedCoupon({
                      ...selectedCoupon,
                      code: e.target.value,
                    })
                  : setNewCoupon({ ...newCoupon, code: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter coupon code"
            />
            <input
              type="number"
              value={
                selectedCoupon ? selectedCoupon.discount : newCoupon.discount
              }
              onChange={(e) =>
                selectedCoupon
                  ? setSelectedCoupon({
                      ...selectedCoupon,
                      discount: e.target.value,
                    })
                  : setNewCoupon({ ...newCoupon, discount: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter discount percentage"
            />
            <div className="flex justify-between">
              <button
                onClick={selectedCoupon ? handleEditCoupon : handleAddCoupon}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                {selectedCoupon ? "Update Coupon" : "Add Coupon"}
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

export default Coupons;
