import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getCustomers } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner'; // ✅ ADD THIS

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.organization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ FIXED: Use LoadingSpinner component
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>
            {user.role === 'admin' ? '👥 All Users' : '🤝 My Partners'}
          </h1>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0 0', fontSize: '14px' }}>
            {user.role === 'admin' && 'Manage all system users'}
            {user.role === 'manufacturer' && 'Hospitals you ship vaccines to'}
            {user.role === 'hospital' && 'Manufacturers you receive vaccines from'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div style={{ padding: '16px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 8px 0' }}>
              Total {user.role === 'admin' ? 'Users' : 'Partners'}
            </p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text)', margin: 0 }}>
              {customers.length}
            </p>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 8px 0' }}>Administrators</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>
              {customers.filter(c => c.role === 'admin').length}
            </p>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 8px 0' }}>Active</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-600)', margin: 0 }}>
              {customers.length}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, backgroundColor: 'var(--card)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Search */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text)', margin: 0 }}>
              {user.role === 'admin' ? 'User List' : 'Partner List'}
            </h2>
            <div style={{ position: 'relative' }}>
              <MagnifyingGlassIcon style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: '16px', 
                height: '16px', 
                color: 'var(--muted)' 
              }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  width: '256px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {filteredCustomers.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
              {customers.length === 0 ? 'No partners found. Start shipping to see them here!' : 'No results found'}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#F9FAFB', position: 'sticky', top: 0 }}>
                <tr>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Email</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Role</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Organization</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer._id || customer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }}
                  >
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: '600',
                          fontSize: '14px'
                        }}>
                          {customer.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span style={{ fontWeight: '500', color: 'var(--text)' }}>{customer.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--muted)' }}>{customer.email || 'N/A'}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: customer.role === 'admin' ? '#FEE2E2' : customer.role === 'manufacturer' ? '#DBEAFE' : '#D1FAE5',
                        color: customer.role === 'admin' ? '#991B1B' : customer.role === 'manufacturer' ? '#1E40AF' : '#065F46'
                      }}>
                        {customer.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text)', fontWeight: '500' }}>
                      {customer.organization || 'N/A'}
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--muted)' }}>
                      {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
