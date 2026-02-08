import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, 
  History, 
  LogOut, 
  Plus, 
  ShoppingCart, 
  Package,
  User, 
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const styles = {
  loginPage: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f8fafc',
    margin: 0,
    padding: '20px',
    boxSizing: 'border-box',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    zIndex: 9999
  },
  dashboardPage: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#f1f5f9',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  authCard: {
    backgroundColor: '#ffffff',
    padding: '50px',
    borderRadius: '4px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '620px',
    textAlign: 'center'
  },
  inputGroup: {
    textAlign: 'left',
    marginBottom: '18px'
  },
  label: {
    fontSize: '10px',
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
    display: 'block',
    marginLeft: '4px'
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    fontSize: '15px',
    boxSizing: 'border-box',
    outline: 'none'
  },
  btnPrimary: (isLogin) => ({
    width: '100%',
    padding: '18px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: isLogin ? '#2563eb' : '#10b981',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    boxShadow: isLogin ? '0 10px 15px -3px rgba(37, 99, 235, 0.2)' : '0 10px 15px -3px rgba(16, 185, 129, 0.2)'
  }),
  checkoutBtn: {
    backgroundColor: '#000000',
    color: 'white',
    padding: '12px 28px',
    borderRadius: '50px',
    border: 'none',
    fontWeight: '900',
    cursor: 'pointer',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('LOGIN');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validate = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.get(`${API_BASE_URL}/items`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsLoggedIn(true);
          setCurrentRoute('HOME');
        } catch (err) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setCurrentRoute('LOGIN');
        }
      } else {
        setIsLoggedIn(false);
        setCurrentRoute('LOGIN');
      }
      setLoading(false);
    };
    validate();
  }, [isLoggedIn]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        await axios.post(`${API_BASE_URL}/users/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {}
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentRoute('LOGIN');
    window.alert("Logged out of ABCDE Shopsy");
  };

  if (loading) return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', backgroundColor:'#f8fafc'}}>
      <div className="spinner"></div>
    </div>
  );

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      {currentRoute === 'LOGIN' ? (
        <div style={styles.loginPage}>
          <div style={styles.authCard}>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <div style={{ backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '20px' }}>
                  <ShoppingBag size={40} color="#2563eb" />
                </div>
              </div>
              <h1 style={{ fontSize: '38px', fontWeight: '900', fontStyle: 'italic', margin: 0, color: '#0f172a', letterSpacing: '-2px' }}>
                ABCDE <span style={{ color: '#2563eb' }}>SHOPSY</span>
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', marginTop: '12px', letterSpacing: '3px', textTransform: 'uppercase' }}>
                Secure Access Portal
              </p>
            </div>
            <LoginForm setLoggedIn={setIsLoggedIn} onAuthSuccess={() => setCurrentRoute('HOME')} />
          </div>
        </div>
      ) : (
        <div style={styles.dashboardPage}>
          <Navbar onLogout={handleLogout} setCurrentRoute={setCurrentRoute} currentRoute={currentRoute} />
          <main style={{ flex: 1, padding: '40px 5%', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
            <ItemList />
          </main>
          <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e2e8f0', padding: '40px 0', textAlign: 'center' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '900', fontStyle: 'italic', margin: 0, color: '#0f172a', opacity: 0.3 }}>
              ABCDE <span style={{ color: '#2563eb' }}>SHOPSY</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Powered by ABCDE Ventures
            </p>
          </footer>
        </div>
      )}
      <style>{`
        html, body, #root { 
          margin: 0; 
          padding: 0; 
          width: 100% !important; 
          height: 100% !important; 
          overflow-x: hidden;
          background-color: #f1f5f9;
        }
        * { box-sizing: border-box; }
        .spinner { width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function LoginForm({ setLoggedIn, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    const endpoint = isLogin ? 'users/login' : 'users';
    
    try {
      const res = await axios.post(`${API_BASE_URL}/${endpoint}`, creds);
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        setLoggedIn(true);
        onAuthSuccess();
      } else {
        window.alert("Account created successfully! You can now login.");
        setIsLogin(true);
        setCreds({ username: '', password: '' });
      }
    } catch (err) {
      const data = err.response?.data;
      if (err.response?.status === 403) {
        setErrorMsg('You cannot login on another device.');
      } else if (typeof data === 'string' && data.includes('E11000')) {
        setErrorMsg('Username already exists. Choose another.');
      } else {
        setErrorMsg('Invalid username or password');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleAuth}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
        <div style={{ width: '6px', height: '24px', backgroundColor: isLogin ? '#2563eb' : '#10b981', borderRadius: '10px' }}></div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Username</label>
        <div style={{ position: 'relative' }}>
          <User size={16} style={{ position: 'absolute', left: '15px', top: '18px', color: '#94a3b8' }} />
          <input 
            style={{ ...styles.input, paddingLeft: '45px' }}
            type="text" 
            placeholder="Enter username" 
            value={creds.username}
            onChange={(e) => setCreds({...creds, username: e.target.value})}
            required 
          />
        </div>
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Password</label>
        <div style={{ position: 'relative' }}>
          <Lock size={16} style={{ position: 'absolute', left: '15px', top: '18px', color: '#94a3b8' }} />
          <input 
            style={{ ...styles.input, paddingLeft: '45px' }}
            type="password" 
            placeholder="Enter password" 
            value={creds.password}
            onChange={(e) => setCreds({...creds, password: e.target.value})}
            required 
          />
        </div>
      </div>
      {errorMsg && (
        <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={14} /> {errorMsg}
        </div>
      )}
      <button type="submit" disabled={isSubmitting} style={styles.btnPrimary(isLogin)}>
        {isSubmitting ? 'PLEASE WAIT...' : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')} 
        {!isSubmitting && <ArrowRight size={18} />}
      </button>
      <div style={{ marginTop: '25px' }}>
        <button 
          type="button" 
          onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
          style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '800', cursor: 'pointer', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}
        >
          {isLogin ? "New to Shopsy? Signup" : "Already a member? Login"}
        </button>
      </div>
    </form>
  );
}

function Navbar({ onLogout, setCurrentRoute, currentRoute }) {
  const token = localStorage.getItem('token');
  const headers = { headers: { Authorization: `Bearer ${token}` } };
  const handleAction = async (endpoint, title) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/${endpoint}`, headers);
      const data = endpoint === 'carts' ? (res.data.items?.map(i => i.itemId).join(', ') || "No items") : res.data.map(o => o._id).join(', ');
      window.alert(`${title}:\n------------------\n${data || "Nothing found"}`);
    } catch { window.alert("Session Error. Please login again."); }
  };
  const handleCheckout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/orders`, {}, headers);
      window.alert("Order successful");
    } catch { window.alert("Checkout failed. Is your cart empty?"); }
  };
  return (
    <nav style={{ backgroundColor: 'white', padding: '20px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', sticky: 'top', zIndex: 100, width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '900', fontStyle: 'italic', margin: 0 }}>
        ABCDE <span style={{ color: '#2563eb' }}>SHOPSY</span>
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <button onClick={() => setCurrentRoute('HOME')} style={{ background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', color: currentRoute === 'HOME' ? '#2563eb' : '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Products</button>
        <button onClick={() => handleAction('carts', 'Cart')} style={{ background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Cart</button>
        <button onClick={() => handleAction('orders', 'History')} style={{ background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>History</button>
        <button onClick={handleCheckout} style={styles.checkoutBtn}>
          <CheckCircle size={16} color="#10b981" /> Checkout
        </button>
        <button onClick={onLogout} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '5px' }}>
          <LogOut size={22} />
        </button>
      </div>
    </nav>
  );
}

function ItemList() {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem('token');
  useEffect(() => {
    axios.get(`${API_BASE_URL}/items`).then(res => setItems(res.data)).catch(() => {});
  }, []);
  const addToCart = async (itemId) => {
    try {
      await axios.post(`${API_BASE_URL}/carts`, { itemId }, { headers: { Authorization: `Bearer ${token}` } });
      window.alert("Item added to cart!");
    } catch { window.alert("Failed to add."); }
  };
  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '900', margin: 0, color: '#0f172a' }}>Catalog</h2>
        <div style={{ width: '60px', height: '6px', backgroundColor: '#2563eb', borderRadius: '10px', marginTop: '10px' }}></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
        {items.map(item => (
          <div key={item._id} style={{ backgroundColor: 'white', padding: '35px', borderRadius: '40px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '30px', marginBottom: '25px', position: 'relative' }}>
              <img src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-img.png" alt="p" style={{ width: '80%' }} />
              <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', color: '#2563eb', border: '1px solid #e2e8f0' }}>New</div>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#1e293b' }}>{item.name}</h3>
            <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '25px' }}>Shopsy Collection</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a' }}>$1,299</span>
              <button 
                onClick={() => addToCart(item._id)} 
                style={{ padding: '12px 25px', backgroundColor: '#2563eb', color: 'white', borderRadius: '18px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} /> ADD
              </button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px 0', backgroundColor: 'white', borderRadius: '40px', border: '2px dashed #e2e8f0' }}>
          <Package size={60} color="#e2e8f0" style={{ marginBottom: '20px' }} />
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#94a3b8', margin: 0 }}>The Shopsy store is quiet today...</p>
        </div>
      )}
    </div>
  );
}