
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5014/api/Account/send-otp', { username });
      setStep(2);
    } catch (err) {
      alert('Failed to send OTP.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5014/api/Account/reset-password', {
        username,
        otp,
        newPassword
      });
      alert('Password reset successful!');
    } catch (err) {
      alert('Password reset failed.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-yellow-50">
      <form onSubmit={step === 1 ? handleSendOTP : handleResetPassword} className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-yellow-700 mb-6">Reset Password</h2>
        <input type="text" placeholder="Username" className="w-full mb-4 p-3 border border-yellow-300 rounded" value={username} onChange={(e) => setUsername(e.target.value)} required />

        {step === 2 && (
          <>
            <input type="text" placeholder="Enter OTP" className="w-full mb-4 p-3 border border-yellow-300 rounded" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <input type="password" placeholder="New Password" className="w-full mb-4 p-3 border border-yellow-300 rounded" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </>
        )}

        <button type="submit" className="w-full bg-yellow-600 text-white py-3 rounded hover:bg-yellow-700 transition">
          {step === 1 ? 'Send OTP' : 'Reset Password'}
        </button>
        <div className="text-center mt-4 text-sm">
          <Link to="/login" className="text-yellow-700 hover:underline">Back to Login</Link>
        </div>
      </form>
    </div>
  );
}
