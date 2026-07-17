import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Page Not Found</h2>
        <p className="notfound-text">The page you are looking for does not exist or has been moved.</p>
        <Link to={isAuthenticated ? "/" : "/signin"} className="notfound-btn">
          {isAuthenticated ? "Back to Menu" : "Go to Sign In"}
        </Link>
      </div>
    </div>
  );
}
