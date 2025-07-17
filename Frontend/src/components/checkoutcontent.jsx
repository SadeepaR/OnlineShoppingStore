import React, { useState, useEffect } from 'react';

export default function CheckoutContent() {
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [userId, setUserId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const SESSION_KEY = 'userSession';
    const storedData = sessionStorage.getItem(SESSION_KEY);
    if (storedData) {
      try {
        const { id } = JSON.parse(storedData);
        setUserId(id);
      } catch {
        console.warn("Invalid session data");
      }
    }
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:8080/api/cart/${userId}`);
        const data = await res.json();
        setCartItems(data);
      } catch (err) {
        console.error("Error fetching cart items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

const handleCheckout = async () => {
  if (!email || !address) {
    alert('Please fill in all fields.');
    return;
  }

  if (!userId) {
    alert('User ID not found. Please start your shopping session again.');
    return;
  }

  const orderPayload = {
    userId,
    userEmail: email,
    shippingAddress: address,
    items: cartItems.map(item => ({
      productId: item.productId,      // Ensure your cart items have productId
      productName: item.name,
      quantity: item.quantity,
      pricePerUnit: item.price
    }))
  };

  try {
    const response = await fetch('http://localhost:8080/api/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert('Failed to place order: ' + (errorData.message || response.statusText));
      return;
    }

    const result = await response.json();

    alert(`Order placed successfully! Order ID: ${result.id}`);

    // Clear form and session
    sessionStorage.removeItem('userSession');
    setEmail('');
    setAddress('');
    setCartItems([]);
  } catch (error) {
    alert('Error placing order: ' + error.message);
  }
};



  return (
    <div className="max-w-6xl mx-auto p-6 mt-3">
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Checkout</h2>

      {loading ? (
        <p className="text-gray-600">Loading your cart...</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Order Summary */}
          <div className="w-full lg:w-1/2 bg-white shadow-md rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Order Summary</h3>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Rs.{item.price} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-indigo-600">
                    Rs.{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6 text-lg font-bold text-gray-800 border-t pt-4">
              <span>Total:</span>
              <span>Rs.{total}</span>
            </div>
          </div>

          {/* Right: Shipping & Payment Info */}
          <div className="w-full lg:w-1/2 bg-white shadow-md rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Shipping Details</h3>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Address */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main Street, City, Zip Code"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
