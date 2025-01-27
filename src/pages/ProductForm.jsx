import React, { useState } from "react";

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
  const [previewImage, setPreviewImage] = useState(null);
   const [productData, setproductData] = useState("");
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
      image, // Use image here (from state, saved as base64 string)
      brand,
      dimensions,
      additionalNotes,
      shippingWeight,
      shippingClass,
      taxClass,
      productUrl,
      availability,
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
    setImage(null); // Clear the image preview
    setBrand(""); // Clear brand
    setDimensions(""); // Clear dimensions
    setAdditionalNotes(""); // Clear additional notes
    setShippingWeight(""); // Clear shipping weight
    setShippingClass(""); // Clear shipping class
    setTaxClass(""); // Clear tax class
    setProductUrl(""); // Clear product URL
    setAvailability("In Stock"); // Clear availability
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Save the base64 string to the image state for submitting
        setImage(event.target.result);  // This will save the base64-encoded string
      };
      reader.readAsDataURL(file); // This creates a base64-encoded string for the image
    }
  };
  
  
  
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

        {/* Category */}
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
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home Appliances">Home Appliances</option>
            <option value="Sports">Sports</option>
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

        {/* Availability */}
        <div className="col-span-2">
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

        <div className="col-span-2">
  <label className="block text-gray-700 text-sm font-semibold">
    Product Image
  </label>
  <input
    type="file"
    onChange={handleImageUpload}
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
