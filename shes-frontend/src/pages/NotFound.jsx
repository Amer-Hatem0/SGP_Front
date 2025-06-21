import React from 'react';
import { Link } from 'react-router-dom';
 

export default function NotFound() {
  return (
    <div className="notfound-container d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="heartbeat-icon mb-4">❤️</div>

        <h1 className="display-1 fw-bold text-danger">404</h1>
        <p className="fs-3">
          <span className="text-danger">Oops!</span> Page not found.
        </p>
        <p className="lead">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link to="/home" className="btn btn-main btn-round-full mt-3">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
