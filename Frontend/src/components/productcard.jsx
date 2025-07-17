import React from 'react';

export default function ProductCard({ id, name, description, price, imageUrl, refreshCart }) {
  const handleAddToCart = async () => {
    const storedData = sessionStorage.getItem('userSession');
    if (!storedData) {
      console.log('User session not found');
      return;
    }

    const { id: userId } = JSON.parse(storedData);
    try {
      const res = await fetch(
        `http://localhost:8080/api/cart/add?userId=${userId}&productId=${id}&quantity=1&name=${name}&price=${price}`,
        { method: 'POST' }
      );
      if (res.ok) {
        console.log('Added to the Cart');
        alert('Product added to cart successfully!');
        if (refreshCart) refreshCart(); 
      } else {
        console.log('Failed to add to the cart');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 w-full max-w-sm
                 transform transition-transform duration-300 hover:scale-105"
    >
      <div className="w-full h-48 rounded-xl overflow-hidden mb-4 flex items-center justify-center bg-gray-50">
        <img src={imageUrl} alt={name} className="object-contain h-full" />
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">{name}</h2>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <p className="text-base font-bold text-indigo-600 mb-4">Rs.{price}</p>
      <button
        onClick={handleAddToCart}
        className="w-full bg-indigo-500 text-white py-2 rounded-xl hover:bg-indigo-700 transition-colors duration-200"
      >
        Add to Cart
      </button>
    </div>
  );
}
