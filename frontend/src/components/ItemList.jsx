import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${API_URL}/items`);
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching items");
      }
    };
    fetchItems();
  }, []);

  const handleAddToCart = async (itemId) => {
    try {
      await axios.post(`${API_URL}/carts`, { itemId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.alert("Item added to cart!");
    } catch (err) {
      window.alert("Failed to add to cart. Please check your session.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Discover Products</h2>
          <p className="text-slate-400 mt-1 font-medium italic">Handpicked items just for you</p>
        </div>
        <div className="h-1 bg-blue-600 w-24 rounded-full hidden md:block mb-1"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map(item => (
          <div key={item._id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group">
            <div className="bg-slate-50 rounded-2xl h-60 flex items-center justify-center mb-6 overflow-hidden relative">
               <img 
                 src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-img.png" 
                 alt="Product Illustration" 
                 className="w-3/4 h-3/4 object-contain opacity-70 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
               />
               <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-blue-600 border border-blue-50">
                 In Stock
               </div>
            </div>
            
            <h3 className="font-bold text-xl text-slate-800 mb-1">{item.name}</h3>
            <p className="text-slate-400 text-sm font-medium mb-6 italic">Official Shopsy Item</p>
            
            <div className="mt-auto flex items-center justify-between">
              <span className="text-3xl font-black text-slate-900">$1,299</span>
              <button 
                onClick={() => handleAddToCart(item._id)}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-blue-700 transition transform active:scale-95 shadow-lg shadow-blue-50"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full py-24 text-center border-4 border-dashed border-slate-100 rounded-3xl">
            <p className="text-slate-300 font-bold text-xl">The Shopsy store is quiet today...</p>
            <p className="text-slate-300 text-sm mt-2">Try seeding some items in your database!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemList;