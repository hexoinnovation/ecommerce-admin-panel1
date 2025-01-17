import React, { useState, useEffect } from "react";
import ProductForm from "../pages/ProductForm"; // Assuming you have a form for adding/editing products
import { collection, addDoc, setDoc, doc, deleteDoc,getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "../components/auth";

function Products() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // For search/filter functionality
  const [categoryFilter, setCategoryFilter] = useState(""); // Filter by category
  const [modalVisible, setModalVisible] = useState(false); // Show/hide modal for product list

  const categories = ["Electronics", "Clothing", "Home Appliances", "Sports"]; // Example categories

  const currentUser = useAuth(); // Get the current user
  const sanitizedEmail = currentUser?.email?.replace(/\s/g, "_");

  useEffect(() => {
    // Fetch products from Firebase and update the local state
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "Products")
        );
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (sanitizedEmail) {
      fetchProducts();
    }
  }, [sanitizedEmail]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (categoryFilter ? product.category === categoryFilter : true)
  );

  const handleAddProduct = async (productData) => {
    try {
      const collectionRef = collection(db, "Products");
      const docRef = await addDoc(collectionRef, productData);
      setProducts([...products, { ...productData, id: docRef.id }]);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  const handleEditProduct = async (productData) => {
    try {
      const docRef = doc(db, "Products", productData.id);
      await setDoc(docRef, productData);
      const updatedProducts = products.map((product) =>
        product.id === productData.id ? productData : product
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const docRef = doc(db,  "Products", productId);
      await deleteDoc(docRef);
      setProducts(products.filter((product) => product.id !== productId));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Form Title and Show Product List Button in same row */}
      <div className="flex justify-between items-center bg-white p-2 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h2>
        <button
          className="p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          onClick={() => setModalVisible(true)}
        >
          Show Product List
        </button>
      </div>

      {/* Product Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <ProductForm
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          existingProduct={editingProduct}
        />
      </div>

      {/* Product List Modal Title */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Product List
            </h2>

            {/* Search Bar for Product List */}
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex justify-between items-center mb-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-4">
              <table className="w-full table-auto text-left">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="py-2 px-3 text-sm font-semibold">
                      Product Name
                    </th>
                    <th className="py-2 px-3 text-sm font-semibold">Price</th>
                    <th className="py-2 px-3 text-sm font-semibold">Stock</th>
                    <th className="py-2 px-3 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="py-2 px-3">{product.name}</td>
                        <td className="py-2 px-3">${product.price}</td>
                        <td className="py-2 px-3">{product.stock}</td>
                        <td className="py-2 px-3 flex items-center space-x-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-2 px-3 text-center text-gray-500"
                      >
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Close Modal Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setModalVisible(false)}
                className="bg-gray-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-600"
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

export default Products;
