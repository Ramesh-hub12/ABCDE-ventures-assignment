import React from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Navbar = ({ onLogout }) => {
  const token = localStorage.getItem('token');
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const handleShowCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/carts`, authHeaders);
      const itemIds = res.data.items?.map(i => `Item: ${i.itemId}`).join(', ') || "No items";
      window.alert(`CART DETAILS\n------------------\nCart ID: ${res.data._id}\nItems: [${itemIds}]`);
    } catch (err) {
      window.alert("Failed to fetch cart. Please login again.");
    }
  };

  const handleShowHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`, authHeaders);
      const orderIds = res.data.map(o => `Order ID: ${o._id}`).join('\n');
      window.alert(`ORDER HISTORY\n------------------\n${orderIds || "No orders placed yet"}`);
    } catch (err) {
      window.alert("Failed to fetch order history.");
    }
  };

  const handleCheckout = async () => {
    try {
      await axios.post(`${API_URL}/orders`, {}, authHeaders);
      window.alert("Order successful");
    } catch (err) {
      window.alert("Checkout failed. Your cart might be empty.");
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-black text-blue-600 italic tracking-tighter">
            ABCDE <span className="text-slate-800">SHOPSY</span>
          </h1>
        </div>

        <div className="flex items-center space-x-6 text-slate-600 font-bold text-sm">
          <button onClick={handleShowCart} className="hover:text-blue-600 transition uppercase tracking-wider">Cart</button>
          <button onClick={handleShowHistory} className="hover:text-blue-600 transition uppercase tracking-wider">Order History</button>
          
          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          <button 
            onClick={handleCheckout}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-50 transition transform active:scale-95"
          >
            Checkout
          </button>

          <button 
            onClick={onLogout} 
            className="text-slate-400 hover:text-red-500 p-2 transition-colors"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;