import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">Store Rating Platform</Link>
        <div className="nav-links">
          {user ? (
            <>
              <span className="navbar-user-greeting">Hello, {user.name} ({user.role})</span>
              {user.role === 'admin' && <Link to="/admin">Dashboard</Link>}
              {user.role === 'user' && <Link to="/user-dashboard">Dashboard</Link>}
              {user.role === 'owner' && <Link to="/owner-dashboard">Dashboard</Link>}
              <Link to="/update-password">Update Password</Link>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
