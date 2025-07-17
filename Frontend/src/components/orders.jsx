import React, { useState, useEffect } from 'react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('productName');

  const handleDeleteOrder = (orderIdToDelete) => {
    setOrders(orders.filter(order => order.orderId !== orderIdToDelete));
  };

  // Filter orders based on selected search parameter
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    
    switch (searchBy) {
      case 'productName':
        return order.items?.some(item => 
          item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'orderId':
        return order.orderId?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      case 'userEmail':
        return order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
      case 'shippingAddress':
        return order.shippingAddress?.toLowerCase().includes(searchTerm.toLowerCase());
      default:
        return true;
    }
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/orders/user-orders`); // Update port if needed
        const data = await res.json();
        console.log(data)
        setOrders(Array.isArray(data) ? data : data.orders || []);

      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Customer Orders</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white"
            >
              <option value="productName">Product Name</option>
              <option value="orderId">Order ID</option>
              <option value="userEmail">Email</option>
              <option value="shippingAddress">Address</option>
            </select>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder={`Search by ${searchBy === 'productName' ? 'product name' : 
                           searchBy === 'orderId' ? 'order ID' : 
                           searchBy === 'userEmail' ? 'email' : 'address'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      {loading ? (
        <p className="text-gray-600">Loading orders...</p>
      ) : (
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Total (Rs.)</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">ORD-{order.orderId}</td>
                <td className="px-4 py-3">
                  <ul className="list-disc ml-4 space-y-1">
                    {order.items?.map((prod, i) => (
                      <li key={i}>
                        <span className="font-medium">{prod.productName}</span> × {prod.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3 text-indigo-600 font-semibold">Rs.{order.totalPrice}</td>
                <td className="px-4 py-3">{order.userEmail}</td>
                <td className="px-4 py-3">{order.shippingAddress}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDeleteOrder(order.orderId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
