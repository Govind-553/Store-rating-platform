import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  
  // States for Add Forms
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [addUserMsg, setAddUserMsg] = useState('');

  const [showAddStore, setShowAddStore] = useState(false);
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [addStoreMsg, setAddStoreMsg] = useState('');

  // Search/Sort States for Users
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [userSortBy, setUserSortBy] = useState('id');
  const [userOrder, setUserOrder] = useState('asc');

  // Search/Sort States for Stores
  const [storeFilters, setStoreFilters] = useState({ name: '', address: '' });
  const [storeSortBy, setStoreSortBy] = useState('name');
  const [storeOrder, setStoreOrder] = useState('asc');

  // View User Details
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
  }, [userSortBy, userOrder, storeSortBy, storeOrder]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/users/dashboard');
      setStats(res.data);
    } catch (err) { console.error('Error fetching stats', err); }
  };

  const fetchUsers = async () => {
    try {
      let url = `/users?sortBy=${userSortBy}&order=${userOrder}`;
      if (userFilters.name) url += `&name=${userFilters.name}`;
      if (userFilters.email) url += `&email=${userFilters.email}`;
      if (userFilters.address) url += `&address=${userFilters.address}`;
      if (userFilters.role) url += `&role=${userFilters.role}`;
      const res = await api.get(url);
      setUsers(res.data);
    } catch (err) { console.error('Error fetching users', err); }
  };

  const fetchStores = async () => {
    try {
      let url = `/stores?sortBy=${storeSortBy}&order=${storeOrder}`;
      if (storeFilters.name) url += `&name=${storeFilters.name}`;
      if (storeFilters.address) url += `&address=${storeFilters.address}`;
      const res = await api.get(url);
      setStores(res.data);
    } catch (err) { console.error('Error fetching stores', err); }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', newUser);
      setAddUserMsg('User added successfully');
      setNewUser({ name: '', email: '', password: '', address: '', role: 'user' });
      fetchUsers();
      fetchStats();
    } catch (err) {
      setAddUserMsg(err.response?.data?.error || err.response?.data?.errors?.join(', ') || 'Failed to add user');
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stores', newStore);
      setAddStoreMsg('Store added successfully');
      setNewStore({ name: '', email: '', address: '', owner_id: '' });
      fetchStores();
      fetchStats();
    } catch (err) {
      setAddStoreMsg(err.response?.data?.error || 'Failed to add store');
    }
  };

  const viewUserDetails = async (id) => {
    try {
      const res = await api.get(`/users/${id}`);
      setSelectedUserDetails(res.data);
    } catch (err) { console.error('Error viewing user details', err); }
  };

  return (
    <div>
      <h1 className="mb-4 text-center">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="flex gap-4 mb-4">
        <div className="card admin-dashboard-stats-card">
          <h3>Total Users</h3>
          <p className="admin-dashboard-stats-value">{stats.totalUsers}</p>
        </div>
        <div className="card admin-dashboard-stats-card">
          <h3>Total Stores</h3>
          <p className="admin-dashboard-stats-value">{stats.totalStores}</p>
        </div>
        <div className="card admin-dashboard-stats-card">
          <h3>Total Ratings</h3>
          <p className="admin-dashboard-stats-value">{stats.totalRatings}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        {/* Add User Section */}
        <div className="card admin-dashboard-section-card">
          <div className="flex justify-between items-center mb-4">
            <h2>Add New User</h2>
            <button className="btn" onClick={() => setShowAddUser(!showAddUser)}>
              {showAddUser ? 'Close' : 'Add User'}
            </button>
          </div>
          {showAddUser && (
            <form onSubmit={handleAddUser} className="flex-col flex">
              {addUserMsg && <p className="text-secondary">{addUserMsg}</p>}
              <input type="text" placeholder="Name (min 20 chars)" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required minLength="20"/>
              <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
              <input type="password" placeholder="Password (8-16 chars)" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required minLength="8" maxLength="16" />
              <input type="text" placeholder="Address (max 400 chars)" value={newUser.address} onChange={e => setNewUser({...newUser, address: e.target.value})} required maxLength="400" />
              <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                <option value="user">User</option>
                <option value="owner">Store Owner</option>
                <option value="admin">System Admin</option>
              </select>
              <button type="submit" className="btn mt-4">Add User</button>
            </form>
          )}
        </div>

        {/* Add Store Section */}
        <div className="card admin-dashboard-section-card">
          <div className="flex justify-between items-center mb-4">
            <h2>Add New Store</h2>
            <button className="btn" onClick={() => setShowAddStore(!showAddStore)}>
              {showAddStore ? 'Close' : 'Add Store'}
            </button>
          </div>
          {showAddStore && (
            <form onSubmit={handleAddStore} className="flex-col flex">
              {addStoreMsg && <p className="text-secondary">{addStoreMsg}</p>}
              <input type="text" placeholder="Store Name" value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value})} required />
              <input type="email" placeholder="Email" value={newStore.email} onChange={e => setNewStore({...newStore, email: e.target.value})} required />
              <input type="text" placeholder="Address" value={newStore.address} onChange={e => setNewStore({...newStore, address: e.target.value})} required />
              <input type="text" placeholder="Owner User ID (optional)" value={newStore.owner_id} onChange={e => setNewStore({...newStore, owner_id: e.target.value})} />
              <button type="submit" className="btn mt-4">Add Store</button>
            </form>
          )}
        </div>
      </div>

      {/* Users List */}
      <div className="card">
        <h2>Users List</h2>
        <div className="flex gap-4 mb-4 admin-dashboard-filter-container">
          <input type="text" placeholder="Filter by Name" className="admin-dashboard-filter-input" value={userFilters.name} onChange={e => setUserFilters({...userFilters, name: e.target.value})} />
          <input type="text" placeholder="Filter by Email" className="admin-dashboard-filter-input" value={userFilters.email} onChange={e => setUserFilters({...userFilters, email: e.target.value})} />
          <input type="text" placeholder="Filter by Address" className="admin-dashboard-filter-input" value={userFilters.address} onChange={e => setUserFilters({...userFilters, address: e.target.value})} />
          <select value={userFilters.role} onChange={e => setUserFilters({...userFilters, role: e.target.value})} className="admin-dashboard-filter-input">
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="owner">Store Owner</option>
            <option value="admin">System Admin</option>
          </select>
          <button className="btn" onClick={fetchUsers}>Apply Filters</button>

          <div className="flex gap-4 items-center">
            Sort By:
            <select value={userSortBy} onChange={e => setUserSortBy(e.target.value)} className="admin-dashboard-sort-select">
              <option value="id">ID</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="address">Address</option>
              <option value="role">Role</option>
            </select>
            Order:
            <select value={userOrder} onChange={e => setUserOrder(e.target.value)} className="admin-dashboard-sort-select">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="admin-dashboard-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th> <th>Name</th> <th>Email</th> <th>Role</th> <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td> <td>{u.name}</td> <td>{u.email}</td> <td>{u.role}</td>
                  <td>
                    <button className="btn" onClick={() => viewUserDetails(u.id)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Details Modal/Area */}
      {selectedUserDetails && (
        <div className="card admin-dashboard-modal-card">
          <div className="flex justify-between items-center mb-4">
            <h2>User Details: {selectedUserDetails.name}</h2>
            <button className="btn btn-secondary" onClick={() => setSelectedUserDetails(null)}>Close</button>
          </div>
          <p><strong>Email:</strong> {selectedUserDetails.email}</p>
          <p><strong>Address:</strong> {selectedUserDetails.address}</p>
          <p><strong>Role:</strong> {selectedUserDetails.role}</p>
          {selectedUserDetails.store && (
            <div className="mt-4 p-4 admin-dashboard-modal-section">
              <h4>Store Owner Details:</h4>
              <p><strong>Store Name:</strong> {selectedUserDetails.store.store_name}</p>
              <p><strong>Store Rating:</strong> {selectedUserDetails.store.overall_rating}</p>
            </div>
          )}
        </div>
      )}

      {/* Stores List */}
      <div className="card">
        <h2>Stores List</h2>
        <div className="flex gap-4 mb-4 admin-dashboard-filter-container">
          <input type="text" placeholder="Filter by Name" className="admin-dashboard-filter-input" value={storeFilters.name} onChange={e => setStoreFilters({...storeFilters, name: e.target.value})} />
          <input type="text" placeholder="Filter by Address" className="admin-dashboard-filter-input" value={storeFilters.address} onChange={e => setStoreFilters({...storeFilters, address: e.target.value})} />
          <button className="btn" onClick={fetchStores}>Apply Filters</button>
          
          <div className="flex gap-4 items-center">
            Sort By:
            <select value={storeSortBy} onChange={e => setStoreSortBy(e.target.value)} className="admin-dashboard-sort-select">
              <option value="name">Name</option>
              <option value="address">Address</option>
              <option value="overall_rating">Rating</option>
            </select>
            Order:
            <select value={storeOrder} onChange={e => setStoreOrder(e.target.value)} className="admin-dashboard-sort-select">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="admin-dashboard-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th> <th>Name</th> <th>Address</th> <th>Email</th> <th>Overall Rating</th> <th>Owner ID</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td> <td>{s.name}</td> <td>{s.address}</td> <td>{s.email}</td> <td>{s.overall_rating}</td> <td>{s.owner_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;
