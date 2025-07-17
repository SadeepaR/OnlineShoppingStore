import React, { use } from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingLogo from '../assets/shopping.png';

export default function checkoutheader() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  }
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Left: Logo and Title */}
        <div className="flex items-center">
          <div className="mx-auto w-10 h-10 rounded-2xl flex items-center justify-center mb-3 mt-3 shadow-lg">
            <img src={ShoppingLogo} alt="Icon" className="w-full" />
          </div>
          <div className="ml-10">
            <h1 className="text-xl font-bold text-gray-800">ShopME</h1>
            <p className="text-sm text-gray-600">E-Commerce System</p>
          </div>
        </div>

        {/* Right: Back Button */}
        <button
          className="text-sm text-indigo-600 border border-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-50 transition"
          onClick={handleBack}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
