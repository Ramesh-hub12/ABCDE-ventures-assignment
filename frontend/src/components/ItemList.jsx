import { useEffect, useState } from 'react';
import axios from 'axios';

const ItemList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/items')
      .then(res => setItems(res.data))
      .catch(err => console.error("Error fetching items"));
  }, []);

  const addToCart = async (itemId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/carts', { itemId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.alert("Item added to cart!");
    } catch (err) {
      window.alert("Session expired. Please login again.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {items.map(item => (
        <div key={item._id} className="bg-white p-4 border rounded shadow hover:shadow-lg transition">
          <h3 className="text-lg font-bold mb-2">{item.name}</h3>
          <p className="text-gray-600 mb-4">{item.status}</p>
          <button 
            onClick={() => addToCart(item._id)}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ItemList;