// VerifyEmail.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
export default function VerifyEmail() {
  const { state } = useLocation();
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const email = state?.email;

  const handleVerify = async () => {
    try {
      await axios.post(`${API_BASE_URL}/Account/verify-email`, {
        email,
        code: otp
      });

      alert('Email verified successfully!');
      navigate('/login');
    } catch (err) {
      alert('Verification failed. Please check the code and try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-green-800 text-center">Verify Email</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Check your email and enter the verification code.</p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full border border-green-300 rounded p-3 mb-4"
        />
        <button onClick={handleVerify} className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-800 transition">
          Verify Email
        </button>
      </div>
    </div>
  );
}
