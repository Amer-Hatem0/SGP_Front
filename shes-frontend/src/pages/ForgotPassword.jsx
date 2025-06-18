import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../style/verify-email.css';
import Header from '../components/Header';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
  await axios.post('http://localhost:5014/api/Account/send-otp', { email, username: email });

      alert('OTP sent to your email.');
      setStep(2);
    } catch (err) {
      alert('Failed to send OTP. Make sure the email is correct.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5014/api/Account/reset-password', {
         username: email,
        otp,
        newPassword
      });
      alert('Password reset successful!');
    } catch (err) {
      alert('Password reset failed. Please check your OTP and try again.');
    }
  };

  return (
    <>
      <Header />
      <div className="forgot-password-container">
        <form
          onSubmit={step === 1 ? handleSendOTP : handleResetPassword}
          className="forgot-password-form"
        >
          <h2 className="form-title">Reset Password</h2>

          <input
            type="email"
            placeholder="Email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {step === 2 && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                className="form-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </>
          )}

          <button type="submit" className="submit-button">
            {step === 1 ? 'Send OTP' : 'Reset Password'}
          </button>

          <div className="back-to-login">
            <Link to="/login" className="login-link">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
