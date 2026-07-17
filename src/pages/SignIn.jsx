import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const { isAuthenticated, login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="branding">
          <div className="icon-wrapper">
            <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="plate-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#f5f2ff" />
                  <stop offset="65%" stopColor="#ebe7fd" />
                  <stop offset="78%" stopColor="#beb9e2" />
                  <stop offset="85%" stopColor="#d6d0f5" />
                  <stop offset="100%" stopColor="#e2ddf8" />
                </radialGradient>
              </defs>
              {/* Plate */}
              <circle cx="32" cy="32" r="16" fill="url(#plate-grad)" />
              
              {/* Fork */}
              <path d="M16 18h1.2v6h1.2v-6h1.2v6h1.2v-6h1.2v7a2.5 2.5 0 0 1-2.5 2.5v12.5a1.25 1.25 0 1 1-2.5 0V27.5a2.5 2.5 0 0 1-2.5-2.5V18Z" fill="#b5b0d4" />
              
              {/* Knife */}
              <path d="M44.5 18c-1.5 0-2 1-2 4v8c0 1 .5 1.5 1.5 2v10a1.25 1.25 0 1 0 2.5 0V32c1-.5 1.5-1 1.5-2V20a2 2 0 0 0-2-2h-1.5Z" fill="#b5b0d4" />
            </svg>
          </div>
          <h1 className="branding-title">Party Menu</h1>
          <p className="branding-subtitle">Sign in to explore our delicious menu</p>
        </div>

        {error && (
          <div className="error-banner">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
            />
          </div>

          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
