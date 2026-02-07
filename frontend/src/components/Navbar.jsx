import axios from 'axios';

const Navbar = ({ onLogout }) => {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const handleCheckout = async () => {
    try {
      // Logic to convert cart to order
      await axios.post('http://localhost:5000/api/orders', {}, { headers });
      window.alert("Order successful!"); 
    } catch (err) {
      window.alert("Checkout failed. Check if cart is empty.");
    }
  };

  const showCart = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/carts', { headers });
      const items = res.data.items?.map(i => i.name).join(', ') || "No items";
      window.alert(`Your Cart: ${items}`);
    } catch (err) { window.alert("Error fetching cart"); }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow px-8">
      <h1 className="text-xl font-bold">E-Shop</h1>
      <div className="space-x-4">
        <button onClick={showCart} className="text-gray-600 hover:underline">Cart</button>
        <button onClick={handleCheckout} className="bg-blue-600 text-white px-4 py-2 rounded">Checkout</button>
        <button onClick={onLogout} className="text-red-500">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;