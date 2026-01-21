// src/pages/AdminDashboard.jsx


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TruckIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { API_URL } from '../config';


const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    inTransit: 0,
    delivered: 0,
    issues: 0
  });
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Read the same user object that Login.jsx stores
        const stored = localStorage.getItem('user');
        if (!stored) {
          console.error('No user in localStorage');
          setLoading(false);
          return;
        }


        const user = JSON.parse(stored);
        const token = user?.token;


        if (!token) {
          console.error('No token on stored user');
          setLoading(false);
          return;
        }


        const response = await axios.get(`${API_URL}/api/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });


        const data = response.data;


        // Support both { total,... } and { totalShipments,... }
        setStats({
          total: data.total || data.totalShipments || 0,
          inTransit: data.inTransit || 0,
          delivered: data.delivered || 0,
          issues: data.issues ?? data.pending ?? 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };


    fetchStats();
  }, []);


  const quickStats = [
    { 
      title: 'Total Shipments', 
      value: stats.total, 
      change: '+12.3%', 
      trend: 'up',
      icon: TruckIcon,
      color: 'var(--primary)'
    },
    { 
      title: 'In Transit', 
      value: stats.inTransit, 
      change: '+8.2%', 
      trend: 'up',
      icon: ClockIcon,
      color: 'var(--primary-600)'
    },
    { 
      title: 'Delivered', 
      value: stats.delivered, 
      change: '+15.1%', 
      trend: 'up',
      icon: CheckCircleIcon,
      color: 'var(--primary-700)'
    },
    { 
      title: 'Issues', 
      value: stats.issues, 
      change: '-23.5%', 
      trend: 'down',
      icon: ExclamationTriangleIcon,
      color: '#ef4444'
    }
  ];


  if (loading) {
    return <LoadingSpinner />;
  }


  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)', overflow: 'auto' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0 0', fontSize: '14px' }}>
            System-wide overview of all shipments
          </p>
        </div>
      </div>


      {/* Main Content */}
      <div style={{ flex: 1, padding: '24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>
            System Overview
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                style={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '12px', 
                  padding: '20px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: `${stat.color}15`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <stat.icon style={{ width: '20px', height: '20px', color: stat.color }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ArrowTrendingUpIcon style={{ 
                      width: '16px', 
                      height: '16px', 
                      color: stat.trend === 'up' ? 'var(--primary-600)' : '#ef4444', 
                      transform: stat.trend === 'down' ? 'rotate(180deg)' : 'none' 
                    }} />
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: stat.trend === 'up' ? 'var(--primary-600)' : '#ef4444'
                    }}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <motion.div 
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                  style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text)', marginBottom: '4px' }}
                >
                  {stat.value}
                </motion.div>
                <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
                  {stat.title}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default AdminDashboard;
