import React, { useState ,useEffect } from "react";
import { CSVLink } from "react-csv"; // For exporting CSV
import { FaPlusCircle, FaFileExport, FaTrashAlt, FaEdit, FaUpload } from "react-icons/fa"; // Icons for actions
import Papa from "papaparse"; // Import papaparse for CSV parsing
import { collection, addDoc,getDocs ,doc,deleteDoc,updateDoc} from "firebase/firestore";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";

function Categories() {
  const [categories, setCategories] = useState([
   
  ]);
  const [categoryName, setCategoryName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [file, setFile] = useState(null); // To store the uploaded file
  const [filteredCategorie, setFilteredCategories] = useState([]);

 // Fetch categories on component mount
 useEffect(() => {
  const fetchCategories = async () => {
    try {
      // Get the currently signed-in user's email
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser || !currentUser.email) {
        alert("No user is signed in. Please sign in to fetch categories.");
        return;
      }

      const userEmail = currentUser.email;

      // Path: "admin/{userEmail}/Categories"
      const categoriesCollectionRef = collection(db, "admin", userEmail, "Categories");

      const querySnapshot = await getDocs(categoriesCollectionRef);
      const categoriesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCategories(categoriesList);
      setFilteredCategories(categoriesList); // Assuming you want to display all initially
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  fetchCategories();
}, []); // Empty dependency array ensures it runs once on component mount

const handleAddCategory = async () => {
  if (!categoryName.trim()) {
    alert("Category name cannot be empty!");
    return;
  }

  try {
    // Get the currently signed-in user's email
    const auth = getAuth(); // Initialize Firebase Auth
    const currentUser = auth.currentUser; // Get the currently signed-in user

    if (!currentUser || !currentUser.email) {
      alert("No user is signed in. Please sign in to add a category.");
      return;
    }

    const userEmail = currentUser.email; // Extract the email of the signed-in user

    // Path: "admin/{userEmail}/Categories" collection
    const categoriesCollectionRef = collection(db, "admin", userEmail, "Categories");

    // Add the new category to Firestore
    const docRef = await addDoc(categoriesCollectionRef, { name: categoryName });
    console.log("Category added with ID:", docRef.id);

    // Update local state (if you want to reflect the added category in the UI)
    const newCategory = { id: docRef.id, name: categoryName }; // Use Firestore-generated ID
    setCategories([...categories, newCategory]);
    setCategoryName(""); // Clear the input field
    setIsModalOpen(false); // Close the modal (if applicable)
  } catch (error) {
    console.error("Error adding category:", error);
    alert("Failed to add category. Please try again.");
  }
};

const handleDeleteCategory = async (categoryId) => {
  try {
    // Get the currently signed-in user's email
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.email) {
      alert("No user is signed in. Please sign in to delete a category.");
      return;
    }

    const userEmail = currentUser.email;

    // Path: "admin/{userEmail}/Categories/{categoryId}"
    const categoryDocRef = doc(db, "admin", userEmail, "Categories", categoryId);

    // Delete the document
    await deleteDoc(categoryDocRef);

    // Update local state
    setCategories(categories.filter((category) => category.id !== categoryId));

    alert("Category deleted successfully!");
  } catch (error) {
    console.error("Error deleting category:", error);
    alert("Failed to delete category. Please try again.");
  }
};

const handleEditCategory = async () => {
  if (!categoryName.trim()) {
    alert("Category name cannot be empty!");
    return;
  }

  try {
    // Get the currently signed-in user's email
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.email) {
      alert("No user is signed in. Please sign in to edit a category.");
      return;
    }

    const userEmail = currentUser.email;

    // Path: "admin/{userEmail}/Categories/{categoryId}"
    const categoryDocRef = doc(db, "admin", userEmail, "Categories", editCategoryId);

    // Update the category in Firestore
    await updateDoc(categoryDocRef, { name: categoryName });

    // Update the local state
    setCategories(
      categories.map((category) =>
        category.id === editCategoryId ? { ...category, name: categoryName } : category
      )
    );

    // Clear input and close modal
    setCategoryName("");
    setEditCategoryId(null);
    setIsModalOpen(false);

    alert("Category updated successfully!");
  } catch (error) {
    console.error("Error updating category:", error);
    alert("Failed to update category. Please try again.");
  }
};

  // Handle deleting multiple categories
  const handleBulkDelete = () => {
    setCategories(categories.filter((category) => !selectedCategories.includes(category.id)));
    setSelectedCategories([]);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle file upload
  const handleFileUpload = () => {
    if (!file) return;

    Papa.parse(file, {
      complete: (result) => {
        const newCategories = result.data.map((row, index) => ({
          id: categories.length + index + 1,
          name: row[0], // Assuming the category name is in the first column
        }));
        setCategories([...categories, ...newCategories]);
        setFile(null); // Reset file after processing
      },
      header: false, // We don't assume headers in the file
    });
  };

  // Filtered categories based on search
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Product Categories</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search categories..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-3 border border-gray-300 rounded-lg mb-6"
      />

      {/* Buttons for adding new category and exporting data */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
        >
          <FaPlusCircle className="mr-2" />
          Add New Category
        </button>

        <CSVLink
          data={categories}
          filename={"categories.csv"}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 flex items-center"
        >
          <FaFileExport className="mr-2" />
          Export Data
        </CSVLink>

        {/* File Upload for Categories */}
        <div className="flex items-center">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="border border-gray-300 py-2 px-4 rounded-md"
          />
          <button
            onClick={handleFileUpload}
            className="bg-yellow-600 text-white py-2 px-4 ml-4 rounded-lg hover:bg-yellow-700 transition duration-200"
          >
            <FaUpload className="mr-2" />
            Upload CSV
          </button>
        </div>
      </div>

      {/* Bulk Delete */}
      {selectedCategories.length > 0 && (
        <button
          onClick={handleBulkDelete}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 mb-4"
        >
          Delete Selected Categories
        </button>
      )}

     {/* Categories Table */}
     <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-indigo-700 text-white">
          <tr>
            <th className="py-3 px-6 text-left">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories(categories.map((category) => category.id));
                  } else {
                    setSelectedCategories([]);
                  }
                }}
              />
            </th>
            <th className="py-3 px-6 text-left">Category Name</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category) => (
            <tr key={category.id} className="border-b hover:bg-gray-100">
              <td className="py-3 px-6">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() =>
                    setSelectedCategories((prev) =>
                      prev.includes(category.id)
                        ? prev.filter((id) => id !== category.id)
                        : [...prev, category.id]
                    )
                  }
                />
              </td>
              <td className="py-3 px-6">{category.name}</td>
              <td className="py-3 px-6 flex space-x-2">
                <button
                  onClick={() => {
                    setCategoryName(category.name);
                    setEditCategoryId(category.id);
                    setIsModalOpen(true);
                  }}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)} // You need to define handleDeleteCategory
                  className="text-red-600 hover:text-red-700"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding and Editing Category */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">
              {editCategoryId ? "Edit Category" : "Add New Category"}
            </h3>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter category name"
            />
            <div className="flex justify-between">
              <button
                onClick={editCategoryId ? handleEditCategory : handleAddCategory}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                {editCategoryId ? "Update Category" : "Add Category"}
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

export default Categories;
