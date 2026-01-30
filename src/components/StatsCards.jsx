import React from 'react';
import { motion } from 'framer-motion';

const StatsCards = ({ stats }) => {
  const totalShipments = stats?.total || 0;
  const inTransit = stats?.inTransit || 0;
  const delivered = stats?.delivered || 0;

  const statsData = [
    { title: 'Shipments', value: totalShipments, color: 'var(--primary)' },
    { title: 'Dispatched', value: inTransit, color: 'var(--primary-600)' },
    { title: 'Delivered', value: delivered, color: 'var(--primary-700)' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div
                style={{ 
                  width: '8px', 
                  height: '8px', 
                  backgroundColor: stat.color, 
                  borderRadius: '50%' 
                }}
              />
              <span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: '500' }}>
                {stat.title}
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text)' }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;
