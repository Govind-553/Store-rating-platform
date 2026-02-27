import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './UserDashboard.css';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  
  // Rating submission modal/form state
  const [ratingData, setRatingData] = useState({ storeId: null, rating: 5 });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStores();
  }, [sortBy, order]);

  const fetchStores = async () => {
    try {
      let url = `/stores?sortBy=${sortBy}&order=${order}`;
      if (filters.name) url += `&name=${filters.name}`;
      if (filters.address) url += `&address=${filters.address}`;
      const res = await api.get(url);
      setStores(res.data);
    } catch (err) {
      console.error('Error fetching stores', err);
      setError('Failed to load stores');
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/ratings', { storeId: ratingData.storeId, rating: parseInt(ratingData.rating) });
      setMessage('Rating submitted successfully!');
      setRatingData({ storeId: null, rating: 5 });
      fetchStores();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit rating');
    }
  };

  const openRatingForm = (storeId, currentRating) => {
    setRatingData({ storeId, rating: currentRating || 5 });
    setMessage('');
    setError('');
  };

  return (
    <div>
      <h1 className="mb-4 text-center">User Dashboard</h1>
      
      <div className="card mb-4 user-dashboard-filter-container">
        <input type="text" placeholder="Search by Name" className="user-dashboard-filter-input" value={filters.name} onChange={e => setFilters({...filters, name: e.target.value})} />
        <input type="text" placeholder="Search by Address" className="user-dashboard-filter-input" value={filters.address} onChange={e => setFilters({...filters, address: e.target.value})} />
        <button className="btn" onClick={fetchStores}>Search</button>

        <div className="user-dashboard-sort-container">
          Sort by:
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="user-dashboard-sort-select">
            <option value="name">Name</option>
            <option value="address">Address</option>
            <option value="overall_rating">Overall Rating</option>
          </select>
          Order:
          <select value={order} onChange={e => setOrder(e.target.value)} className="user-dashboard-sort-select">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {message && <div className="card mb-4 text-success text-center user-dashboard-message-card">{message}</div>}
      {error && <div className="card mb-4 text-danger text-center user-dashboard-message-card">{error}</div>}

      <div className="user-dashboard-store-list flex-col" style={{ gap: '1rem' }}>
        {stores.map(store => (
          <div key={store.id} className="card flex justify-between items-center user-dashboard-store-card">
            <div>
              <h3>{store.name}</h3>
              <p className="text-light">{store.address}</p>
              <div className="mt-4 flex gap-4">
                <span className="user-dashboard-rating-text">Overall: {store.overall_rating} ★</span>
                <span>|</span>
                <span className={`${store.user_rating ? 'text-primary' : 'text-light'} user-dashboard-rating-text`}>
                  Your Rating: {store.user_rating ? store.user_rating + ' ★' : 'Not Rated'}
                </span>
              </div>
            </div>
            
            <div className="user-dashboard-action-area">
              {ratingData.storeId === store.id ? (
                <form onSubmit={handleRatingSubmit} className="flex gap-4 items-center justify-between user-dashboard-rating-form">
                  <select 
                    value={ratingData.rating} 
                    onChange={e => setRatingData({...ratingData, rating: e.target.value})}
                    className="user-dashboard-rating-select"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="btn btn-secondary user-dashboard-submit-btn">Submit</button>
                  <button type="button" className="btn user-dashboard-cancel-btn" onClick={() => setRatingData({ storeId: null, rating: 5 })}>Cancel</button>
                </form>
              ) : (
                <button 
                  className="btn" 
                  onClick={() => openRatingForm(store.id, store.user_rating)}
                >
                  {store.user_rating ? 'Modify Rating' : 'Submit Rating'}
                </button>
              )}
            </div>
          </div>
        ))}
        {stores.length === 0 && <div className="text-center mt-4">No stores found.</div>}
      </div>
    </div>
  );
};

export default UserDashboard;
