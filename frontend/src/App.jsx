import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, LogOut, Plus, 
   ArrowRight,  Package, X, 
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';


const styles = {
  loginPage: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#f8fafc', zIndex: 9999, fontFamily: 'system-ui, sans-serif'
  },
  authCard: {
    backgroundColor: '#ffffff', padding: '50px', borderRadius: '4px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', width: '100%',
    maxWidth: '620px', textAlign: 'center', border: '1px solid #e2e8f0'
  },
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 10000,
    backdropFilter: 'blur(4px)'
  },
  modalContent: {
    backgroundColor: 'white', padding: '40px', borderRadius: '4px',
    width: '90%', maxWidth: '500px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
  },
  formInput: {
    width: '100%', padding: '12px 15px', borderRadius: '4px', border: '1px solid #e2e8f0',
    marginBottom: '15px', outline: 'none', fontSize: '14px', fontFamily: 'inherit'
  },
  btnPrimary: (isLogin) => ({
    width: '100%', padding: '18px', borderRadius: '4px', border: 'none',
    backgroundColor: isLogin ? '#2563eb' : '#10b981',
    color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
    marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px'
  }),
  checkoutBtn: {
    backgroundColor: '#000000', color: 'white', padding: '10px 24px',
    borderRadius: '4px', border: 'none', fontWeight: '900', cursor: 'pointer',
    fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px',
    display: 'flex', alignItems: 'center', gap: '8px'
  }
};


function AuthHeader() {
  return (
    <div style={{ marginBottom: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '8px' }}>
          <ShoppingBag size={48} color="#2563eb" />
        </div>
      </div>
      <h1 style={{ fontSize: '42px', fontWeight: 900, fontStyle: 'italic', margin: 0, color: '#1e293b' }}>
        ABCDE <span style={{ color: '#2563eb' }}>SHOPSY</span>
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold', marginTop: '12px', letterSpacing: '4px' }}>
        SECURE ACCESS PORTAL
      </p>
    </div>
  );
}

function LoginForm({ setLoggedIn, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [creds, setCreds] = useState({ username: '', password: '' });

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'users/login' : 'users/register';
    try {
      const res = await axios.post(`${API_BASE_URL}/${endpoint}`, creds);
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        setLoggedIn(true);
        onAuthSuccess();
      } else {
        window.alert("User account gets created! Please Login.");
        setIsLogin(true);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        window.alert('You cannot login on another device.'); 
      } else {
        window.alert('Invalid username/password'); 
      }
    }
  };

  return (
    <form onSubmit={handleAuth} style={{ textAlign: 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '35px' }}>
        <div style={{ width: '8px', height: '28px', backgroundColor: isLogin ? '#2563eb' : '#10b981' }}></div>
        <h2 style={{ fontSize: '28px', fontWeight: 900, margin: 0 }}>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
      </div>
      <input 
        style={{ ...styles.formInput, padding: '16px' }} 
        placeholder="Username" 
        value={creds.username}
        onChange={e => setCreds({...creds, username: e.target.value})} 
        required 
      />
      <input 
        type="password" 
        style={{ ...styles.formInput, padding: '16px' }} 
        placeholder="Password" 
        value={creds.password}
        onChange={e => setCreds({...creds, password: e.target.value})} 
        required 
      />
      <button type="submit" style={styles.btnPrimary(isLogin)}>
        <span>{isLogin ? 'LOG IN' : 'CREATE ACCOUNT'}</span>
        <ArrowRight size={20} />
      </button>
      <button 
        type="button" 
        onClick={() => setIsLogin(!isLogin)} 
        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginTop: '25px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', width: '100%', fontSize: '13px' }}
      >
        {isLogin ? "New user? Create an account" : "Back to Login"}
      </button>
    </form>
  );
}

function AddItemModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/items`, formData);
      window.alert("Product listed successfully!");
      onSuccess();
    } catch (err) {
      window.alert("Failed to add product.");
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
          <X size={24} />
        </button>
        <h2 style={{ fontWeight: 900, fontSize: '24px', marginBottom: '25px', color: '#1e293b' }}>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <input style={styles.formInput} placeholder="Product Name" onChange={e => setFormData({...formData, name: e.target.value})} required />
          <textarea style={{ ...styles.formInput, height: '80px', resize: 'none' }} placeholder="Description" onChange={e => setFormData({...formData, description: e.target.value})} required />
          <input type="number" style={styles.formInput} placeholder="Price ($)" onChange={e => setFormData({...formData, price: e.target.value})} required />
          <input style={styles.formInput} placeholder="Picture URL (Optional)" onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
          <button type="submit" style={{ ...styles.btnPrimary(true), marginTop: '10px' }}>LIST PRODUCT</button>
        </form>
      </div>
    </div>
  );
}

function Navbar({ onLogout, onAddClick }) {
  const token = localStorage.getItem('token');
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const fetchAlert  = async (path) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/${path}`, headers);
    if (path === 'carts') {
      
      const cartId = res.data._id;
      const itemIds = res.data.items?.map(i => `Item ID: ${i.itemId}`).join('\n') || "Empty";
      window.alert(`CART DETAILS\nCart ID: ${cartId}\n\nItems:\n${itemIds}`);
    } else {
      
      const orderIds = res.data.map(o => `Order ID: ${o._id}`).join('\n');
      window.alert(`ORDER HISTORY\n\n${orderIds || "No history found"}`);
    }
  } catch (err) {
    window.alert("Session Error or Failed to fetch details.");
  }
};

const handleCheckout = async () => {
  try {
    await axios.post(`${API_BASE_URL}/orders`, {}, headers);
    window.alert("Order successful");
    
    window.location.reload(); 
  } catch (err) {
    window.alert(err.response?.data || "Checkout failed");
  }
};

  return (
    <nav style={{ backgroundColor: 'white', padding: '15px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
      <div style={{ lineHeight: '1' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b', margin: 0 }}>ABCDE</h1>
        <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b', margin: 0 }}>SHOPSY</h1>
      </div>
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        <button onClick={onAddClick} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', color: '#2563eb', cursor: 'pointer' }}>
          <Plus size={16} /> ADD PRODUCT
        </button>
        <button onClick={() => fetchAlert('carts', 'Cart')} style={{ background: 'none', border: 'none', fontWeight: '800', cursor: 'pointer', color: '#64748b', fontSize: '11px' }}>CART</button>
        <button onClick={() => fetchAlert('orders', 'History')} style={{ background: 'none', border: 'none', fontWeight: '800', cursor: 'pointer', color: '#64748b', fontSize: '11px' }}>HISTORY</button>
        <button onClick={handleCheckout} style={styles.checkoutBtn}>CHECKOUT</button>
        <button onClick={onLogout} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}><LogOut size={22} /></button>
      </div>
    </nav>
  );
}

function ItemList({ refreshKey }) {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/items`).then(res => setItems(res.data)).catch(() => {});
  }, [refreshKey]);

  const addToCart = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/carts`, { itemId: id }, { headers: { Authorization: `Bearer ${token}` } });
      window.alert("Item Added to Cart"); 
    } catch { window.alert("Add to Cart failed."); }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
      {items.map(item => (
        <div key={item._id} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '4px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '4px', marginBottom: '20px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img 
              src={item.imageUrl || "https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-img.png"} 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
              alt="product" 
            />
          </div>
          <h3 style={{ fontWeight: '800', fontSize: '18px', color: '#334155', margin: '0 0 8px 0' }}>{item.name}</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: '0 0 20px 0', flex: 1 }}>{item.description}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
            <p style={{ fontWeight: '900', fontSize: '24px', color: '#0f172a', margin: 0 }}>${item.price}</p>
            <button 
              onClick={() => addToCart(item._id)} 
              style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px', border: '2px dashed #e2e8f0', borderRadius: '4px' }}>
          <Package size={48} color="#e2e8f0" style={{ marginBottom: '20px' }} />
          <p style={{ color: '#94a3b8', fontWeight: 'bold' }}>Catalog is empty. Add a product to get started!</p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('LOGIN');
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.get(`${API_BASE_URL}/items`, { headers: { Authorization: `Bearer ${token}` } });
          setIsLoggedIn(true);
          setCurrentRoute('HOME');
        } catch {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setCurrentRoute('LOGIN');
        }
      }
      setLoading(false);
    };
    validateSession();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_BASE_URL}/users/logout`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch {}
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentRoute('LOGIN');
    window.alert("Logged out successfully"); 
  };

  if (loading) return null;

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <style>{`
        html, body, #root { margin: 0; padding: 0; width: 100% !important; height: 100% !important; overflow: hidden; background-color: #f8fafc; }
        * { box-sizing: border-box; }
      `}</style>

      {currentRoute === 'LOGIN' ? (
        <div style={styles.loginPage}>
          <div style={styles.authCard}>
            <AuthHeader />
            <LoginForm setLoggedIn={setIsLoggedIn} onAuthSuccess={() => setCurrentRoute('HOME')} />
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
          <Navbar onLogout={handleLogout} onAddClick={() => setShowAddModal(true)} />
          <main style={{ flex: 1, overflowY: 'auto', padding: '40px 8%', width: '100%' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b', margin: 0 }}>Product Catalog</h2>
                <div style={{ width: '50px', height: '4px', backgroundColor: '#2563eb', marginTop: '10px' }}></div>
              </div>
              <ItemList refreshKey={refreshKey} />
            </div>
          </main>
          <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e2e8f0', padding: '20px 0', textAlign: 'center', flexShrink: 0 }}>
            <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', margin: 0 }}>ABCDE VENTURES © 2026</p>
          </footer>
          {showAddModal && (
            <AddItemModal 
              onClose={() => setShowAddModal(false)} 
              onSuccess={() => { setShowAddModal(false); setRefreshKey(k => k + 1); }} 
            />
          )}
        </div>
      )}
    </div>
  );
}