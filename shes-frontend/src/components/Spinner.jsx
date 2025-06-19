import React from 'react';
import { RingLoader } from 'react-spinners';

const Spinner = ({ message = 'Loading...', size = 100, color = '#007bff' }) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <RingLoader size={size} color={color} />
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );
};

export default Spinner;
