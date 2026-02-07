// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import { useState, useEffect } from 'react';
import Login from './components/Login';
import ItemList from './components/ItemList';
import Navbar from './components/Navbar';
import axios from 'axios';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setLoggedIn(true);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/users/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Logout cleanup failed");
    } finally {
      
      localStorage.removeItem('token');
      setLoggedIn(false);
      window.alert("Logged out successfully");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn ? (
        <Login setLoggedIn={setLoggedIn} />
      ) : (
        <>
          <Navbar onLogout={handleLogout} />
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center my-8 text-gray-800">
              ABCDE Shopping Portal
            </h2>
            <ItemList />
          </div>
        </>
      )}
    </div>
  );
}

export default App;