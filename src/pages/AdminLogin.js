import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './AdminLogin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';

function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [usernameValid, setUsernameValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if the admin is already logged in
  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (admin) {
      navigate('/admin/challenges');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    let valid = true;
    if (credentials.username === '') {
      setUsernameValid(false);
      valid = false;
    } else {
      setUsernameValid(true);
    }

    if (credentials.password === '') {
      setPasswordValid(false);
      valid = false;
    } else {
      setPasswordValid(true);
    }

    if (!valid) {
      if (!toast.isActive('fill-fields')) {
        toast.error('Please fill in all fields correctly!', { toastId: 'fill-fields', closeButton: false });
      }
      return;
    }

    setLoading(true);
    try {
      // const res = await axios.post('http://localhost:5000/api/admin/login', credentials);

      const res = await axios.post(
        "https://startupathonbackend-production.up.railway.app/api/admin/login",
        credentials,
        { withCredentials: true } // ✅ Ensures cookies and auth headers are included
      );
    
      if (res.data.success) {
        localStorage.setItem("admin", true);
        navigate("/admin/challenges");
        toast.success("Login successful!", { closeButton: false });
      } else {
        setError("Invalid credentials");
        if (!toast.isActive("invalid-cred")) {
          toast.error("Invalid credentials!", {
            toastId: "invalid-cred",
            closeButton: false,
          });
        }
      }
    } catch (error) {
      setError('Login failed');
      if (!toast.isActive('login-failed')) {
        toast.error('Login failed, please try again!', { toastId: 'login-failed', closeButton: false });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className={usernameValid ? '' : 'error'}
              required
              autoComplete="off"
            />
          </div>
          {!usernameValid && <span className="error-message">Username is required</span>}

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className={passwordValid ? '' : 'error'}
              required
              autoComplete="new-password"
            />
            <div
              className="toggle-password"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          {!passwordValid && <span className="error-message">Password is required</span>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <ClipLoader size={20} color="#fff" /> : 'Login'}
          </button>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminLogin;
