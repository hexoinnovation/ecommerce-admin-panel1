import React, { useState } from "react";
import { CSVLink } from "react-csv"; // For exporting CSV
import { FaPlusCircle, FaFileExport, FaTrashAlt, FaEdit, FaUpload } from "react-icons/fa"; // Icons for actions
import Papa from "papaparse"; // Import papaparse for CSV parsing

function Categories() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Electronics" },
    { id: 2, name: "Fashion" },
    { id: 3, name: "Home & Kitchen" },
  ]);
  const [categoryName, setCategoryName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [file, setFile] = useState(null); // To store the uploaded file

  // Handle adding new category
  const handleAddCategory = () => {
    if (!categoryName.trim()) return;
    const newCategory = { id: categories.length + 1, name: categoryName };
    setCategories([...categories, newCategory]);
    setCategoryName("");
    setIsModalOpen(false);
  };

  // Handle deleting a category
  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
  };

  // Handle editing a category
  const handleEditCategory = () => {
    setCategories(
      categories.map((category) =>
        category.id === editCategoryId ? { ...category, name: categoryName } : category
      )
    );
    setCategoryName("");
    setEditCategoryId(null);
    setIsModalOpen(false);
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
                  onClick={() => handleDeleteCategory(category.id)}
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
            <h3 className="text-2xl font-semibold mb-4">
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
