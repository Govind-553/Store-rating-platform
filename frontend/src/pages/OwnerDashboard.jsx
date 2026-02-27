import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('u.name');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    fetchDashboard();
  }, [sortBy, order]);

  const fetchDashboard = async () => {
    try {
      const res = await api.get(`/ratings/owner-dashboard?sortBy=${sortBy}&order=${order}`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard');
    }
  };

  if (error) {
    return (
      <div className="card text-center owner-dashboard-error-card">
        <h2>Owner Dashboard</h2>
        <p className="text-danger mt-4">{error}</p>
      </div>
    );
  }

  if (!data) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div>
      <h1 className="mb-4 text-center">Store Owner Dashboard</h1>
      
      <div className="card text-center mb-4">
        <h2>{data.storeName}</h2>
        <p className="owner-dashboard-stats-value">
          Average Rating: <span className="text-primary">{data.averageRating} ★</span>
        </p>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2>Users who rated this store</h2>
          
          <div className="flex gap-4 items-center">
            Sort by:
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="owner-dashboard-sort-select">
              <option value="u.name">Name</option>
              <option value="u.email">Email</option>
              <option value="r.rating">Rating</option>
              <option value="r.updated_at">Date</option>
            </select>
            Order:
            <select value={order} onChange={e => setOrder(e.target.value)} className="owner-dashboard-sort-select">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="owner-dashboard-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>User Email</th>
                <th>Rating</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.ratings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No ratings yet.</td>
                </tr>
              ) : (
                data.ratings.map((rating, idx) => (
                  <tr key={idx}>
                    <td>{rating.name}</td>
                    <td>{rating.email}</td>
                    <td className="text-primary owner-dashboard-rating-value">{rating.rating} ★</td>
                    <td>{new Date(rating.updated_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
