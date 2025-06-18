// // VerifyEmail.jsx
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import API_BASE_URL from '../config/apiConfig';
// export default function VerifyEmail() {
//   const { state } = useLocation();
//   const [otp, setOtp] = useState('');
//   const navigate = useNavigate();
//   const email = state?.email;

//   const handleVerify = async () => {
//     try {
//       await axios.post(`${API_BASE_URL}/Account/verify-email`, {
//         email,
//         code: otp
//       });

//       alert('Email verified successfully!');
//       navigate('/login');
//     } catch (err) {
//       alert('Verification failed. Please check the code and try again.');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-green-50">
//       <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-4 text-green-800 text-center">Verify Email</h2>
//         <p className="text-sm text-gray-500 text-center mb-6">Check your email and enter the verification code.</p>
//         <input
//           type="text"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           placeholder="Enter OTP"
//           className="w-full border border-green-300 rounded p-3 mb-4"
//         />
//         <button onClick={handleVerify} className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-800 transition">
//           Verify Email
//         </button>
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
import '../style/verify-email.css';
  import Header from '../components/Header';
export default function VerifyEmail() {
  const { state } = useLocation();
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const email = state?.email || 'tavneet@example.com'; // Fallback email

  const handleVerify = async () => {
    if (!otp.trim() || otp.length !== 6) {
      alert('Please enter a valid 6-digit verification code.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/Account/verify-email`, {
        email,
        code: otp,
      });

      alert('Email verified successfully!');
      navigate('/login');
    } catch (err) {
      alert('Verification failed. Please check the code and try again.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    
    const newOtp = otp.split('');
    newOtp[index] = value;
    setOtp(newOtp.join(''));
    
    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  return (
         <>      <Header /> 
    <div className="verify-email-container ">
      <div className="verify-email-card">
        <div className="email-icon-container">
          <div className="email-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B46C1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="email-svg"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
        </div>
        
        <h2 className="verify-email-title">Verify Your Email</h2>
        
        <p className="verify-email-subtitle">
         Please Enter The Verification Code
        </p>

        {/* OTP Input Fields */}
        <div className="otp-inputs-container">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[index] || ''}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="otp-input"
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleVerify}
          className="verify-button"
        >
          Verify Email
        </button>
        
        {/* Resend Code Option */}
        <p className="resend-code-text">
          Didn't receive a code?{' '}
          <button className="resend-button">
            Resend Code
          </button>
        </p>
      </div>
    </div></>
  );
}