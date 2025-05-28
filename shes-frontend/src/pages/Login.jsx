
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveUserToLocalStorage } from '../utils/auth';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5014/api/Account/Login', {
      userName: email,
      password: password,
    });

    const token = res.data.token;
    const decoded = JSON.parse(atob(token.split('.')[1]));

    const role = decoded.role || 'Patient';
    const userId = parseInt(decoded.sub); 

    if (!userId) {
      console.error("❌ Failed to extract userId from token:", decoded);
      alert("Login succeeded, but user ID is missing.");
      return;
    }
 
    saveUserToLocalStorage({ token, role, userId });
 
    switch (role) {
      case 'Patient': return navigate('/patient/home');
      case 'Doctor': return navigate('/doctor/home');
      case 'Supervisor': return navigate('/supervisor/home');
      case 'Admin': return navigate('/admin/home');
      default: return navigate('/login');
    }
  } catch (err) {
    console.error("Login error:", err);
    alert('Login failed. Invalid credentials.');
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-6">Welcome Back</h2>
        <input type="email" required placeholder="Email Address" className="w-full mb-4 p-3 border border-blue-300 rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required placeholder="Password" className="w-full mb-4 p-3 border border-blue-300 rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition">Sign in</button>

        <div className="text-center mt-4 text-sm">
          <Link to="/register" className="text-blue-700 hover:underline mr-4">Create account</Link>
          <Link to="/forgot-password" className="text-blue-700 hover:underline">Forgot password?</Link>
        </div>
      </form>
    </div>
  );
}