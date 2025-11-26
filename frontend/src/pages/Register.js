import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");  
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post('/auth/register', { name, email, password });
      nav('/login');
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h3>Register</h3>

      {error && <div className="alert alert-danger">{error}</div>} 

      <form onSubmit={submit}>
        <input
          className="form-control mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
        />

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

        <button className="btn btn-success w-100">Register</button>
      </form>
    </div>
  );
}
