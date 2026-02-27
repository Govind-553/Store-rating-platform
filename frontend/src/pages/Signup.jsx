import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      const res = await api.post('/auth/signup', formData);
      login(res.data.token, res.data.user);
      navigate('/user-dashboard');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors([err.response?.data?.error || 'Signup failed']);
      }
    }
  };

  return (
    <div className="card auth-card">
      <h2 className="text-center">Sign Up (Normal User)</h2>
      {errors.length > 0 && (
        <div className="text-danger mb-4">
          <ul>
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex-col flex">
        <label>Name (20-60 chars)</label>
        <input 
          type="text" name="name"
          value={formData.name} onChange={handleChange} required minLength="20" maxLength="60"
        />
        
        <label>Email</label>
        <input 
          type="email" name="email"
          value={formData.email} onChange={handleChange} required 
        />
        
        <label>Address (max 400 chars)</label>
        <textarea 
          name="address" rows="3"
          value={formData.address} onChange={handleChange} required maxLength="400"
        />

        <label>Password (8-16 chars, 1 uppercase, 1 special char)</label>
        <div className="password-input-wrapper">
          <input 
            type={showPassword ? "text" : "password"} name="password"
            value={formData.password} onChange={handleChange} required minLength="8" maxLength="16"
          />
          <button 
            type="button" 
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button type="submit" className="btn mt-4">Sign Up</button>
      </form>
      <div className="text-center mt-4">
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};

export default Signup;
