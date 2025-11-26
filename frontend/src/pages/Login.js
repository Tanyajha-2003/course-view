import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");  
  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const r = await API.post('/auth/login', { email, password });

      localStorage.setItem('token', r.data.token);
      login(r.data.user);

      nav('/');
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h3>Login</h3>

      {error && <div className="alert alert-danger">{error}</div>}   

      <form onSubmit={submit}>
        <input
          className="form-control mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />

        <input
          type="password"
          className="form-control mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />

        <button className="btn btn-success w-100">Login</button>
      </form>
    </div>
  );
}
