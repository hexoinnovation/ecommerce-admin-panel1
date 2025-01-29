import React, { useState, useEffect } from "react";
import { collection, addDoc,getDocs,doc,getDoc,setDoc} from "firebase/firestore";
import { db,auth } from "../components/firebase";

// Assuming the ProductForm component handles the form for adding/editing products
function ProductForm({ onSubmit, existingProduct }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [sku, setSku] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [rating, setRating] = useState("");
  const [tags, setTags] = useState("");
  const [visible, setVisible] = useState(true);
  const [image, setImage] = useState(null);
  const [brand, setBrand] = useState(""); // New Control
  const [dimensions, setDimensions] = useState(""); // New Control
  const [additionalNotes, setAdditionalNotes] = useState(""); // New Control
  const [shippingWeight, setShippingWeight] = useState(""); // Shipping weight
  const [shippingClass, setShippingClass] = useState(""); // Shipping class
  const [taxClass, setTaxClass] = useState(""); // Tax Class
  const [productUrl, setProductUrl] = useState(""); // Product URL
  const [availability, setAvailability] = useState("In Stock"); // Product availability


  const handleSubmit = (e) => {
    e.preventDefault();

    const tagsArray = tags.split(",").map((tag) => tag.trim());

    const productData = {
      name,
      price,
      description,
      stock,
      category,
      sku,
      discountPrice: discountPrice || null,
      rating,
      tags: tagsArray,
      visible,
      image,
      brand,
      dimensions,
      additionalNotes,
      shippingWeight,
      shippingClass,
      taxClass,
      productUrl,
      availability,
      isBestOffer, // ✅ Added Best Offer Product in data
      
    };

    onSubmit(productData);

    // Clear form after submission
    setName("");
    setPrice("");
    setDescription("");
    setStock("");
    setCategory("");
    setSku("");
    setDiscountPrice("");
    setRating("");
    setTags("");
    setVisible(true);
    setImage(null);
    setBrand(""); // Clear brand
    setDimensions(""); // Clear dimensions
    setAdditionalNotes(""); // Clear additional notes
    setShippingWeight(""); // Clear shipping weight
    setShippingClass(""); // Clear shipping class
    setTaxClass(""); // Clear tax class
    setProductUrl(""); // Clear product URL
    setAvailability("In Stock"); // Clear availability
    setIsBestOffer(false); // ✅ Reset Best Offer Product selection
  };



  const [isBestOffer, setIsBestOffer] = useState(false); // State for radio button
   const [categories, setCategories] = useState([]); // Store fetched categories
 
   // Get current user email
   const userEmail = auth.currentUser?.email; 
  useEffect(() => {
    const fetchCategories = async () => {
      if (!userEmail) return; // Ensure user is logged in

      try {
        const categoriesCollectionRef = collection(db, "admin", userEmail, "Categories");
        const querySnapshot = await getDocs(categoriesCollectionRef);

        // Extract category names from documents
        const fetchedCategories = querySnapshot.docs.map((doc) => doc.data().name); 
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [userEmail]); // Re-run if userEmail changes

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded-lg shadow-md max-h-screen flex flex-col"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
        {/* Product Name */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold">
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Product Name"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold">
            SKU
          </label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="SKU"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold">
            Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Price"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold">
            Stock
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Stock"
          />
        </div>

        <div>
      <label className="block text-gray-700 text-sm font-semibold">
        Category
      </label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <option value="">Select Category</option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>

        {/* Discount Price */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold">
            Discount Price
          </label>
          <input
            type="number"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Discount Price"
          />
        </div>

        {/* Product Rating */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold">
            Product Rating
          </label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Rating (1-5)"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold">
            Brand
          </label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Brand"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold">
            Product Availability
          </label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Preorder">Preorder</option>
          </select>
        </div>
 {/* Product Image */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold">
          Product Image
          </label>
          <input
            type="file"
            onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          {image && (
            <div className="mt-4">
              <img
                src={image}
                alt="Product Preview"
                className="max-w-full h-auto rounded-md"
              />
            </div>
          )}
        </div>
{/* Best Offer Product Radio Button */}
<div className="mt-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Best Offer Product
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="bestOffer"
              value="yes"
              checked={isBestOffer}
              onChange={() => setIsBestOffer(true)}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="bestOffer"
              value="no"
              checked={!isBestOffer}
              onChange={() => setIsBestOffer(false)}
              className="mr-2"
            />
            No
          </label>
        </div>
      </div>
       </div>

      <button
        type="submit"
        className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg mt-6 hover:bg-gray-700 transition duration-300"
      >
        {existingProduct ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}

export default ProductForm;
