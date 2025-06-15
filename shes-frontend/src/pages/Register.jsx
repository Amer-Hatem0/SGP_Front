import API_BASE_URL from '../config/apiConfig';

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({
    userName: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    age: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/Account/Register`, form);
      alert('Registered successfully. Check your email for OTP code.');
      navigate('/verify-email', { state: { email: form.email } });
    } catch (err) {
      if (err.response) {
        alert('Registration failed: ' + err.response.data.message);
      } else {
        alert('Registration failed: ' + err.message);
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-success">
      <div className="col-md-8 col-lg-6 shadow-lg rounded-4 p-5 bg-white">
        <h2 className="text-center text-success fw-bold mb-4">Create Your Account</h2>
        <form onSubmit={handleRegister}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="userName" className="form-label fw-semibold">Username</label>
              <input
                type="text"
                id="userName"
                name="userName"
                className="form-control form-control-lg border-success"
                placeholder="Choose a username"
                value={form.userName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="fullName" className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-control form-control-lg border-success"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="email" className="form-label fw-semibold">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control form-control-lg border-success"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="phoneNumber" className="form-label fw-semibold">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="form-control form-control-lg border-success"
                placeholder="Enter phone number"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="gender" className="form-label fw-semibold">Gender</label>
              <input
                type="text"
                id="gender"
                name="gender"
                className="form-control form-control-lg border-success"
                placeholder="e.g Male / Female"
                value={form.gender}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="dateOfBirth" className="form-label fw-semibold">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                className="form-control form-control-lg border-success"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="age" className="form-label fw-semibold">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                className="form-control form-control-lg border-success"
                placeholder="Enter your age"
                value={form.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="password" className="form-label fw-semibold">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control form-control-lg border-success"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-lg btn-success w-100 mt-4 fw-semibold shadow-sm"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/login" className="text-decoration-none text-success">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}