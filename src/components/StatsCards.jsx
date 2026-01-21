import React from 'react';
import { motion } from 'framer-motion';

const StatsCards = ({ stats }) => {
  // match the fields returned by /api/stats
  const totalShipments = stats?.total || 0;
  const inTransit = stats?.inTransit || 0;
  const delivered = stats?.delivered || 0;

  const statsData = [
    { title: 'Shipments', value: totalShipments, change: '+3.2%', color: 'var(--primary)' },
    { title: 'Dispatched', value: inTransit, change: '+5.1%', color: 'var(--primary-600)' },
    { title: 'Delivered', value: delivered, change: '+2.8%', color: 'var(--primary-700)' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
      <motion.div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{
              y: -4,
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              transition: { duration: 0.2 }
            }}
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <motion.div
                    style={{ width: '8px', height: '8px', backgroundColor: stat.color, borderRadius: '50%' }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <span style={{ fontSize: '14px', color: 'var(--muted)' }}>{stat.title}</span>
                </div>
                <motion.div
                  style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text)' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.15, type: 'spring', stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>1 Month Ago</div>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--primary-600)', fontWeight: '500' }}>
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default StatsCards;
