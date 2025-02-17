import React, { useState, useEffect } from "react";
import ProductForm from "../pages/ProductForm"; // Assuming you have a form for adding/editing products
import { collection, addDoc, setDoc, doc, deleteDoc,getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "../components/auth";
import { getAuth } from "firebase/auth";
import {Pencil, Box  } from "lucide-react"; // Import the icons
import { motion } from "framer-motion";
function Products() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // For search/filter functionality
  const [categoryFilter, setCategoryFilter] = useState(""); // Filter by category
  const [modalVisible, setModalVisible] = useState(false); // Show/hide modal for product list
  const [categories, setCategories] = useState([]);
  const currentUser = useAuth(); // Get the current user
  const sanitizedEmail = currentUser?.email?.replace(/\s/g, "_");
  const [filteredProduct, setFilteredProducts] = useState([]);
  const auth = getAuth();
  const userEmail = auth.currentUser ? auth.currentUser.email : null;
  const [editingProducts, setEditingProductState] = useState(null);
  const [image, setImage] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  
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
      // Get the current user's email
      const auth = getAuth(); // Initialize Firebase Auth
      const currentUser = auth.currentUser; // Get the currently signed-in user
  
      if (!currentUser || !currentUser.email) {
        alert("No user is signed in. Please sign in to add a product.");
        return;
      }
  
      const userEmail = currentUser.email; // Extract the email of the signed-in user
  
      // Firestore collection path with dynamic email
      const collectionRef = collection(
        db,
        "admin",
        userEmail, // Use the current user's email
        "products"
      );
  
      // Add the product to Firestore
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
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      if (!currentUser || !currentUser.email) {
        alert("No user is signed in. Please sign in to edit a product.");
        return;
      }
  
      const userEmail = currentUser.email;
      const docRef = doc(db, "admin", userEmail, "products", productData.id);
  
      // Ensure the image is included in Firestore update
      await setDoc(docRef, { ...productData, image: editingProduct.image });
  
      const updatedProducts = products.map((product) =>
        product.id === productData.id ? { ...productData, image: editingProduct.image } : product
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingProduct({ ...editingProduct, image: event.target.result }); // Update the editing product's image
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleDeleteProduct = async (productId) => {
  try {
    // Get the current user's email
    const auth = getAuth(); // Initialize Firebase Auth
    const currentUser = auth.currentUser; // Get the currently signed-in user

    if (!currentUser || !currentUser.email) {
      alert("No user is signed in. Please sign in to delete a product.");
      return;
    }

    const userEmail = currentUser.email; // Extract the email of the signed-in user

    // Firestore document path with dynamic email
    const docRef = doc(db, "admin", userEmail, "products", productId);

    // Delete the product from Firestore
    await deleteDoc(docRef);
    setProducts(products.filter((product) => product.id !== productId));
    alert("Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Failed to delete product. Please try again.");
  }
};

  // Fetch products from Firestore
useEffect(() => {
  const fetchProducts = async () => {
    try {
      // Get the current user's email
      const auth = getAuth(); // Initialize Firebase Auth
      const currentUser = auth.currentUser; // Get the currently signed-in user

      if (!currentUser || !currentUser.email) {
        console.error("No user is signed in. Please sign in to view products.");
        return;
      }

      const userEmail = currentUser.email; // Extract the user's email

      // Specify the path to your 'Products' collection
      const productsCollectionRef = collection(
        db,
        "admin",
        userEmail, // Use the current user's email
        "products"
      );

      // Fetch products from Firestore
      const productSnapshot = await getDocs(productsCollectionRef);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id, // Firestore-generated ID
        ...doc.data() // Data from the document
      }));

      setProducts(productList);
      setFilteredProducts(productList); // Set filtered products if needed
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchProducts();
}, []); // Dependency array, no additional dependencies required here

useEffect(() => {
  if (!userEmail) return; // Prevent fetching if userEmail is not available
  
  const fetchCategories = async () => {
    try {
      const categoriesCollectionRef = collection(db, "admin", userEmail, "Categories");
      const categorySnapshot = await getDocs(categoriesCollectionRef);
      
      // Fetching categories (documents inside Categories collection)
      const categoryList = categorySnapshot.docs.map((doc) => doc.data().name); // Assuming each category has a `name` field
      setCategories(categoryList);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  fetchCategories();
}, [userEmail]);



  return (
    <div className="space-y-6">
      {/* Product Form Title and Show Product List Button in same row */}
      <div className="flex justify-between items-center bg-white p-2 rounded-lg shadow-md mb-4 ml-10">
      <div className="flex items-center ml-5">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {editingProduct ? (
          <Box size={24} className="text-blue-600 mr-2" />
        ) : (
          <Box size={24} className="text-blue-600 mr-2" />
        )}
      </motion.div>
      <h2 className="text-xl font-semibold text-gray-800 text-blue-600 ml-2">
        {editingProduct ? " Add New Product" : "Add New Product"}
      </h2>
    </div>
        <button
          className="p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          onClick={() => setModalVisible(true)}
        >
          Show Product List
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md mb-4 ml-10">
        <ProductForm
          onSubmit={editingProduct ? handleAddProduct : handleAddProduct}
          existingProduct={editingProduct}
        />
      </div>

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full sm:w-1/2 md:w-3/4 lg:w-2/5 xl:w-2/4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Product List
            </h2>

            {/* Search Bar */}
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
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Product List Table */}
            <div className="overflow-y-auto max-h-80 bg-white rounded-lg shadow-md mb-4">
              <table className="w-full table-auto text-left">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="py-2 px-3 text-sm font-semibold">Image</th>
                    <th className="py-2 px-3 text-sm font-semibold">Product Name</th>
                    <th className="py-2 px-3 text-sm font-semibold">Price</th>
                    <th className="py-2 px-3 text-sm font-semibold">Discount Price</th>
                    <th className="py-2 px-3 text-sm font-semibold">Stock</th>
                    <th className="py-2 px-3 text-sm font-semibold">Product Availability</th>
                    <th className="py-2 px-3 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="py-2 px-3">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-full"
                            />
                          ) : (
                            <span>No image</span>
                          )}
                        </td>
                        <td className="py-2 px-3">{product.name}</td>
                        <td className="py-2 px-3">₹{product.price}</td>
                        <td className="py-2 px-3">₹{product.discountPrice}</td>
                        <td className="py-2 px-3">{product.stock}</td>
                        <td className="py-2 px-3">{product.availability}</td>
                        <td className="py-2 px-3 flex items-center space-x-2">
                        <button
  onClick={() => {
    setEditingProduct(product); // Set the product to be edited
    setEditModalVisible(true);  // Open the edit modal
  }}
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
                      <td colSpan="7" className="py-2 px-3 text-center text-gray-500">
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
{editModalVisible && editingProduct && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 px-4">
    <div className="bg-white p-5 rounded-xl shadow-lg w-full sm:w-3/4 md:w-2/5 lg:w-1/3">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Edit Product</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleEditProduct(editingProduct);
        }}
      >
        {/* Product Name */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            value={editingProduct.name}
            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter product name"
          />
        </div>

        {/* Price & Discount Price */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700">Price</label>
            <input
              type="number"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Price"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Discount Price</label>
            <input
              type="number"
              value={editingProduct.discountPrice}
              onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: e.target.value })}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Discount Price"
            />
          </div>
        </div>

        {/* Stock & Availability */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700">Stock</label>
            <input
              type="number"
              value={editingProduct.stock}
              onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Stock"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Availability</label>
            <select
              value={editingProduct.availability}
              onChange={(e) => setEditingProduct({ ...editingProduct, availability: e.target.value })}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="inStock">In Stock</option>
              <option value="outStock">Out of Stock</option>
              <option value="preOrder">Pre Order</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e)}
            className="w-full text-sm p-2 border border-gray-300 rounded-md"
          />
          {editingProduct.image && (
            <div className="mt-2">
              <img
                src={editingProduct.image}
                alt="Product Preview"
                className="w-20 h-20 object-cover rounded-md border border-gray-300"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => setEditModalVisible(false)}
            className="bg-gray-500 text-white text-sm py-2 px-4 rounded-md shadow hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white text-sm py-2 px-4 rounded-md shadow hover:bg-blue-600 transition"
          >
          Update
          </button>
        </div>
      </form>
    </div>
  </div>
)}



    </div>
  );
}

export default Products;
