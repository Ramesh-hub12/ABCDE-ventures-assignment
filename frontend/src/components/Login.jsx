import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Login = ({ setLoggedIn }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // const handleAuth = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const endpoint = isLoginView ? 'users/login' : 'users';

  //   try {
  //     const res = await axios.post(`${API_URL}/${endpoint}`, { username, password });
      
  //     if (isLoginView) {
  //       localStorage.setItem('token', res.data.token);
  //       setLoggedIn(true);
  //     } else {
  //       window.alert("Registration successful! Welcome to ABCDE Shopsy. Please login now.");
  //       setIsLoginView(true);
  //     }
  //   } catch (err) {
  //     if (err.response?.status === 403) {
  //       window.alert('You cannot login on another device.');
  //     } else {
  //       window.alert(err.response?.data || 'Invalid username or password');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'users/login' : 'users/register';
    
    try {
      const res = await axios.post(`${API_BASE_URL}/${endpoint}`, creds);
      
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        setIsLoggedIn(true);
        setCurrentRoute('HOME');
      } else {
        window.alert("Account created successfully! Please login.");
        setIsLogin(true);
        setCreds({ username: '', password: '' });
      }
    } catch (err) {
      // Requirement: Handle specific error case for single-device restriction
      if (err.response && err.response.status === 403) {
        // Show the specific popup as per Step 3.2
        window.alert('You cannot login on another device.');
      } else {
        window.alert(err.response?.data || 'Invalid username/password');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-blue-600 tracking-tighter italic">
            ABCDE <span className="text-slate-800">SHOPSY</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">Elevating your shopping experience</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-blue-600 pl-3">
            {isLoginView ? 'Login' : 'Create Account'}
          </h2>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Username</label>
            <input 
              type="text" 
              placeholder="Enter username"
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              placeholder="Enter password"
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition transform active:scale-95 disabled:bg-slate-300 shadow-lg shadow-blue-100"
          >
            {loading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Join Shopsy')}
          </button>

          <div className="text-center mt-6">
            <button 
              type="button" 
              onClick={() => setIsLoginView(!isLoginView)} 
              className="text-sm text-blue-600 font-bold hover:underline"
            >
              {isLoginView ? "Don't have an account? Create one" : "Already have an account? Log in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;