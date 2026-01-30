import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TruckIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { API_URL } from '../config';

const ManufacturerDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    inTransit: 0,
    delivered: 0,
    issues: 0
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    const fetchStats = async () => {
      try {
        const stored = localStorage.getItem('user');
        if (!stored) {
          console.error('No user in localStorage');
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(stored);
        const token = parsedUser?.token;

        if (!token) {
          console.error('No token on stored user');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/api/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data;

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
      title: 'Total Shipped', 
      value: stats.total, 
      icon: TruckIcon,
      color: '#11B0CD'
    },
    { 
      title: 'In Transit', 
      value: stats.inTransit, 
      icon: ClockIcon,
      color: '#11B0CD'
    },
    { 
      title: 'Delivered', 
      value: stats.delivered, 
      icon: CheckCircleIcon,
      color: '#10B981'
    },
    { 
      title: 'Issues', 
      value: stats.issues, 
      icon: ExclamationTriangleIcon,
      color: '#EF4444'
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Manufacturer Dashboard
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          {user?.organization ? `Shipments from ${user.organization}` : 'Your shipment overview'}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-4">
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                <span className="text-sm font-medium text-gray-700">
                  {stat.title}
                </span>
              </div>

              <div className="text-3xl font-bold text-gray-900">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
