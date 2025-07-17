import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import HeaderAdmin from '../components/headeradmin';
import AddProducts from '../components/addproducts';
import Orders from '../components/orders';
import Products from '../components/products';


export default function admin() {
  const [view, setView] = useState('Orders');
  const { logout } = useAuth();

  const renderView = () => {
    switch (view) {
      case 'Orders':
        return <Orders />;
      case 'Inventory':
        return <Products />;
      case 'Add Products':
        return <AddProducts />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <HeaderAdmin logout={logout}/>
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-2 shadow-sm border border-gray-200">
          {['Orders', 'Inventory', 'Add Products'].map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                view === tab
                  ? 'bg-gradient-to-r from-[#ed1743] to-[#ed2898] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
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
                  d="M7 8h10M7 12h6m-6 4h8M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H7l-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {tab}
            </button>
          ))}
        </div>

        <div className="transition-transform duration-500 ease-in-out">
          {renderView()}
        </div>
      </div>
    </div>
  );
}
