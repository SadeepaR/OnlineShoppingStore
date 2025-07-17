import React, { useState, useRef, useEffect } from 'react';
import ShoppingLogo from '../assets/shopping.png';
import CartIcon from '../assets/shopping-cart.png';
import { useNavigate } from 'react-router-dom';

export default function Header({ cartItems, refreshCart, onSearch }) { // Add onSearch prop
  const [showSearch, setShowSearch] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const cartRef = useRef();
  const searchInputRef = useRef();
  const navigate = useNavigate();

  const userId = JSON.parse(sessionStorage.getItem('userSession'))?.id;

  const updateQuantity = async (productId, delta) => {
    const item = cartItems.find((item) => item.productId === productId);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);

    try {
      await fetch(
        `http://localhost:8080/api/cart/update?userId=${userId}&productId=${productId}&quantity=${newQty}`,
        {
          method: 'PUT'
        }
      );
      refreshCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await fetch(`http://localhost:8080/api/cart/remove?userId=${userId}&productId=${productId}`, {
        method: 'DELETE'
      });
      refreshCart();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const clearCart = async () => {
    try {
      await fetch(`http://localhost:8080/api/cart/clear/${userId}`, {
        method: 'DELETE'
      });
      refreshCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setShowCartDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value); // Call the onSearch prop to pass the search term up
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    } else {
      alert('Your cart is empty!');
    }
  };

  const handleAdminLogin = () => {
    navigate('/login');
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 rounded-xl p-4 mb-6 relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mx-auto w-10 h-10 rounded-2xl flex items-center justify-center mb-3 mt-3 shadow-lg">
            <img src={ShoppingLogo} alt="Icon" className="w-full" />
          </div>
          <div className="ml-10">
            <h1 className="text-xl font-bold text-gray-800">ShopME</h1>
            <p className="text-sm text-gray-600">E-Commerce System</p>
          </div>
        </div>

        <div className="flex items-center gap-4 relative">
          <button
            onClick={handleAdminLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Login as Admin
          </button>

          <button
            onClick={() => setShowSearch((prev) => !prev)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </button>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showSearch ? 'w-48 sm:w-64 opacity-100' : 'w-0 opacity-0'
            }`}
          >
            <input
              type="text"
              ref={searchInputRef}
              placeholder="Search..."
              className="w-full px-3 py-1 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm} // Bind value to state
              onChange={handleSearchChange} // Handle changes
            />
          </div>

          <div className="relative" ref={cartRef}>
            <button onClick={() => setShowCartDropdown((prev) => !prev)} className="w-8 h-8 cursor-pointer">
              <img src={CartIcon} alt="Cart" className="w-full h-full object-contain" />
            </button>

            {showCartDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-gray-100 shadow-lg rounded-xl border border-gray-500 p-4 z-50">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Your Cart</h3>

                {cartItems.length === 0 && <p className="text-gray-500 text-sm text-center">Your cart is empty.</p>}

                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-700">{item.name}</p>
                      <p className="text-sm text-gray-500">Rs.{item.price}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.productId, -1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, 1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-500 ml-2 hover:text-red-700"
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="text-indigo-600 font-semibold ml-2">
                      Rs.{item.price * item.quantity}
                    </p>
                  </div>
                ))}

                {cartItems.length > 0 && (
                  <>
                    <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-gray-800 ">
                      <span>Total:</span>
                      <span>Rs.{total}</span>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="mt-4 w-full bg-gray-600 text-white py-2 rounded-xl hover:bg-gray-700 transition"
                    >
                      Go to Checkout
                    </button>

                    <button
                      onClick={clearCart}
                      className="mt-2 w-full bg-red-100 text-red-600 py-2 rounded-xl hover:bg-red-200 transition"
                    >
                      Clear Cart
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}