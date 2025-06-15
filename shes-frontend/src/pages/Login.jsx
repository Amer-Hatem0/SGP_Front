 
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveUserToLocalStorage } from '../utils/auth';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/Account/Login`, {
        userName: email,
        password: password,
      });

      const token = res.data.token;
      const decoded = JSON.parse(atob(token.split('.')[1]));
console.log("🔍 Decoded token:", decoded);

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
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-primary">
      <div className="col-md-6 col-lg-5 shadow-lg rounded-4 p-5 bg-white">
        <h2 className="text-center text-primary fw-bold mb-4">Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control form-control-lg border-primary"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold">Password</label>
            <input
              type="password"
              id="password"
              className="form-control form-control-lg border-primary"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-lg btn-primary w-100 mt-3 fw-semibold shadow-sm"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/register" className="text-decoration-none text-primary me-3">Create account</Link>
          <Link to="/forgot-password" className="text-decoration-none text-primary">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}