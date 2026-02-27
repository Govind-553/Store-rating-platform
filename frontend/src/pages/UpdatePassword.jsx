import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './UpdatePassword.css';

const UpdatePassword = () => {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.put('/auth/update-password', passwords);
      setMessage(res.data.message);
      setPasswords({ currentPassword: '', newPassword: '' });
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
    }
  };

  return (
    <div className="card update-password-card">
      <h2 className="text-center">Update Password</h2>
      {message && <div className="text-success mb-4 text-center">{message}</div>}
      {error && <div className="text-danger mb-4 text-center">{error}</div>}
      
      <form onSubmit={handleSubmit} className="flex-col flex">
        <label>Current Password</label>
        <input 
          type="password" name="currentPassword"
          value={passwords.currentPassword} onChange={handleChange} required 
        />
        
        <label>New Password (8-16 chars, 1 uppercase, 1 special char)</label>
        <input 
          type="password" name="newPassword"
          value={passwords.newPassword} onChange={handleChange} required minLength="8" maxLength="16"
        />

        <button type="submit" className="btn mt-4">Update Password</button>
      </form>
    </div>
  );
};

export default UpdatePassword;
