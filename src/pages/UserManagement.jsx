import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import { API_URL } from '../config';


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');


  useEffect(() => {
    fetchUsers();
  }, []);


  const fetchUsers = async () => {
    try {
      // ✅ FIXED: Get token directly from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };


  const handleToggleStatus = async (userId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'enable' : 'disable'} this user?`)) {
      return;
    }

    try {
      // ✅ FIXED: Get token directly from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchUsers();
      } else {
        alert('Failed to update user status');
      }
    } catch (error) {
      alert('Network error');
    }
  };


  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to DELETE user ${userEmail}? This cannot be undone!`)) {
      return;
    }

    try {
      // ✅ FIXED: Get token directly from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      alert('Network error');
    }
  };


  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });


  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: { bg: '#ede9fe', text: '#7c3aed' },
      manufacturer: { bg: '#dbeafe', text: '#2563eb' },
      hospital: { bg: '#d1fae5', text: '#059669' },
      distributor: { bg: '#fef3c7', text: '#d97706' }
    };
    return colors[role] || { bg: '#f3f4f6', text: '#6b7280' };
  };


  if (loading) {
    return <LoadingSpinner />;
  }


  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          User Management
        </h1>
        <p style={{ color: '#6b7280' }}>Manage all users in the system</p>
      </div>


      {error && (
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '12px' }}>
          <p style={{ color: '#dc2626', margin: 0 }}>{error}</p>
        </div>
      )}


      <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Search Users
            </label>
            <input
              type="text"
              placeholder="Search by name, email, or organization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>


          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Filter by Role
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'white',
                boxSizing: 'border-box'
              }}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manufacturer">Manufacturer</option>
              <option value="hospital">Hospital</option>
              <option value="distributor">Distributor</option>
            </select>
          </div>
        </div>


        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <motion.div 
            whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}
            transition={{ duration: 0.2 }}
            style={{ textAlign: 'center', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '12px', cursor: 'pointer' }}
          >
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6', margin: '0 0 4px 0' }}>{users.length}</p>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Total Users</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)' }}
            transition={{ duration: 0.2 }}
            style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '12px', cursor: 'pointer' }}
          >
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#22c55e', margin: '0 0 4px 0' }}>{users.filter(u => !u.disabled).length}</p>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Active</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' }}
            transition={{ duration: 0.2 }}
            style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fef2f2', borderRadius: '12px', cursor: 'pointer' }}
          >
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444', margin: '0 0 4px 0' }}>{users.filter(u => u.disabled).length}</p>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Disabled</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(168, 85, 247, 0.2)' }}
            transition={{ duration: 0.2 }}
            style={{ textAlign: 'center', padding: '16px', backgroundColor: '#faf5ff', borderRadius: '12px', cursor: 'pointer' }}
          >
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#a855f7', margin: '0 0 4px 0' }}>{filteredUsers.length}</p>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Filtered</p>
          </motion.div>
        </div>
      </div>


      <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}>
              <tr>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: 'white' }}>User</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: 'white' }}>Organization</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: 'white' }}>Role</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: 'white' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: 'white' }}>Created</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: 'white' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '48px 24px', textAlign: 'center', color: '#9ca3af' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr 
                    key={user._id} 
                    style={{ 
                      borderTop: index > 0 ? '1px solid #e5e7eb' : 'none',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {user.profilePhoto ? (
                          <img
                            src={user.profilePhoto}
                            alt={user.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid #e5e7eb'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '16px'
                          }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p style={{ fontWeight: '600', color: '#111827', margin: 0, fontSize: '14px' }}>{user.name}</p>
                          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', color: '#374151' }}>{user.organization}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: getRoleBadgeColor(user.role).bg,
                        color: getRoleBadgeColor(user.role).text
                      }}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {user.disabled ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '14px' }}>
                          <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                          </svg>
                          Disabled
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontSize: '14px' }}>
                          <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Active
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#6b7280' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => handleToggleStatus(user._id, user.disabled)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: user.disabled ? '#22c55e' : '#f59e0b',
                            color: 'white'
                          }}
                        >
                          {user.disabled ? 'Enable' : 'Disable'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => handleDeleteUser(user._id, user.email)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: '#ef4444',
                            color: 'white'
                          }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </td>
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


export default UserManagement;
