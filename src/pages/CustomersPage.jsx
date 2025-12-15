import React from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const CustomersPage = () => {
  const customers = [
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh.kumar@email.com', phone: '+91 98765 43210', shipments: 24, status: 'Active' },
    { id: 2, name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+91 98765 43211', shipments: 18, status: 'Active' },
    { id: 3, name: 'Amit Patel', email: 'amit.patel@email.com', phone: '+91 98765 43212', shipments: 31, status: 'Active' },
    { id: 4, name: 'Sneha Reddy', email: 'sneha.reddy@email.com', phone: '+91 98765 43213', shipments: 12, status: 'Inactive' },
    { id: 5, name: 'Vikram Singh', email: 'vikram.singh@email.com', phone: '+91 98765 43214', shipments: 45, status: 'Active' },
    { id: 6, name: 'Ananya Iyer', email: 'ananya.iyer@email.com', phone: '+91 98765 43215', shipments: 28, status: 'Active' }
  ];


  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Customers</h1>
            <p style={{ color: 'var(--muted)', margin: '4px 0 0 0', fontSize: '14px' }}>Manage your customer database</p>
          </div>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            <PlusIcon style={{ width: '18px', height: '18px' }} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <div style={{ padding: '16px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 8px 0' }}>Total Customers</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text)', margin: 0 }}>800</p>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 8px 0' }}>Active</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>600</p>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 8px 0' }}>New This Month</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-600)', margin: 0 }}>50</p>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 8px 0' }}>Total Orders</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text)', margin: 0 }}>3,200</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div style={{ flex: 1, backgroundColor: 'var(--card)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Table Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text)', margin: 0 }}>Customer List</h2>
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
                placeholder="Search customers..."
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
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#F9FAFB', position: 'sticky', top: 0 }}>
              <tr>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Customer Name</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Email</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Phone</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Total Shipments</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} style={{ borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>
                        {customer.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: '500', color: 'var(--text)' }}>{customer.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--muted)' }}>{customer.email}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--muted)' }}>{customer.phone}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text)', fontWeight: '500' }}>{customer.shipments}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: customer.status === 'Active' ? 'var(--chip-bg)' : '#f3f4f6',
                      color: customer.status === 'Active' ? 'var(--primary-700)' : 'var(--muted)',
                      border: customer.status === 'Active' ? '1px solid #D8F0F7' : '1px solid #e5e7eb'
                    }}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
