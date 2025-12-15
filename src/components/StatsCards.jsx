import React from 'react';

const StatsCards = () => {
  const stats = [
    { title: 'Shipments', value: '9,000', change: '+3.2%', color: 'var(--primary)' },
    { title: 'Dispatched', value: '7,000', change: '+5.1%', color: 'var(--primary-600)' },
    { title: 'Delivered', value: '5,000', change: '+2.8%', color: 'var(--primary-700)' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        {stats.map((stat, index) => (
          <div key={index} style={{ 
            backgroundColor: 'var(--card)', 
            border: '1px solid var(--border)', 
            borderRadius: '8px', 
            padding: '16px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: stat.color, borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '14px', color: 'var(--muted)' }}>{stat.title}</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text)' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>1 Month Ago</div>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--primary-600)', fontWeight: '500' }}>{stat.change}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;
