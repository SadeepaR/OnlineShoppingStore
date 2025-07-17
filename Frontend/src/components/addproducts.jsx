import React, { useState } from 'react';

export default function addproducts() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      photo: e.target.files[0],
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    const productData = {
      name: product.name,
      description: product.description,
      quantity: parseInt(product.quantity),
      pricePerUnit: parseFloat(product.price)
    };
    formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json"}));
    formData.append("image", product.photo)
    try{
      const response = await fetch("http://localhost:8080/api/products/add",{
        method: "POST",
        body: formData
      })

      if (response.ok){
        const savedProduct = await response.json();
        console.log(`Saved Product ${savedProduct}`)
        alert("Product added successfully!");
        setProduct({
          name: '',
          description: '',
          price: '',
          quantity: '',
          photo: null,
        });
        e.target.reset();
      }else{
        const error = await response.text();
        console.log("Failed to add product" + error)
      }
    }catch(err){
      console.error("Upload Error:", err)
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="4"
            required
            className="w-full border px-4 py-2 rounded-lg border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Price per unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
          <input
            type="number"
            name="price"
            min="0"
            value={product.price}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Initial Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Initial Quantity</label>
          <input
            type="number"
            name="quantity"
            min="0"
            value={product.quantity}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          onSubmit={handleSubmit}
          className="px-4 py-2 bg-gray-500 py-2 px-4 rounded-lg text-white border border-gray-300 font-medium hover:bg-gray-700 hover:border-gray-400 transition-colors text-sm"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
