import React from 'react';
import ShoppingLogo from '../assets/shopping.png';
import { useNavigate } from 'react-router-dom';

export default function HeaderAdmin({ logout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 rounded-xl p-4 mb-6 relative z-10">
      <div className="flex items-center justify-between">
        {/* Logo and title */}
        <div className="flex items-center">
          <div className="mx-auto w-10 h-10 rounded-2xl flex items-center justify-center mb-3 mt-3 shadow-lg">
            <img src={ShoppingLogo} alt="Icon" className="w-full" />
          </div>
          <div className="ml-10">
            <h1 className="text-xl font-bold text-gray-800">ShopME - Admin Portal</h1>
            <p className="text-sm text-gray-600">E-Commerce System</p>
          </div>
        </div>

        {/* Navigation and Logout Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleGoHome}
            className="px-4 py-2 bg-gray-600 rounded-lg text-white border border-gray-300 font-medium hover:bg-gray-700 transition-colors text-sm flex items-center"
          >
            {/* <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg> */}
            Catalog
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#ed1743] rounded-lg text-white border border-gray-300 font-medium hover:bg-red-600 transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
