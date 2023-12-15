// Login.js
import React, { useState } from 'react';

const Login = ({ onLogin, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:8080/users/${username}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      const userData = await response.json();

      if (userData.password === password) {
        onLogin(username);
      } else {
        throw new Error('Invalid password');
      }
    } catch (error) {
        if (error.message !== 'Failed to fetch') {
            setError(error.message);
        } else {
            setError("Invalid username")
        }
    } finally {
        setLoading(false)
    }
  };

  return (
    <div >
      <h1 className="text-3xl font-semibold mb-4 text-center">Login</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin} disabled={loading} className={`bg-teal-500 w-full text-white p-2 rounded hover:bg-teal-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
        
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <div className="mt-4">
        <span className="text-gray-600">Don't have an account?</span>
        <button onClick={onRegister} className="text-blue-500 underline ml-2 cursor-pointer">Register</button>
      </div>
    </div>
  );
};

export default Login;
