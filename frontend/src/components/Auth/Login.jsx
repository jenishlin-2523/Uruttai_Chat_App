// src/components/Auth/Login.js (Updated)

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UruttaImage from '../../assets/1.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect to chat if already logged in
  useEffect(() => {
    if (user) {
      navigate('/chat');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password); 
      navigate('/chat'); // ✅ Navigate to chat after login
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side: Image/Branding */}
      <div className="auth-left">
        <img
          src={UruttaImage}
          alt="Urutta Chat App Logo"
          className="auth-image"
        />
      </div>

      {/* Right Side: Login Form */}
      <div className="auth-right">
        <div className="auth-box">
          <h2>Welcome Back</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account?
            <Link to="/register">
              <button>Register</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
