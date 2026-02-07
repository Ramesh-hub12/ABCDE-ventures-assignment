import { useState } from 'react';
import axios from 'axios';

const Login = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setLoggedIn(true);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        window.alert('You cannot login on another device.'); 
      } else {
        window.alert('Invalid username or password');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
        <input 
          type="text" placeholder="Username" className="w-full border p-2 mb-4 rounded"
          onChange={(e) => setUsername(e.target.value)} required
        />
        <input 
          type="password" placeholder="Password" className="w-full border p-2 mb-6 rounded"
          onChange={(e) => setPassword(e.target.value)} required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
};

export default Login;