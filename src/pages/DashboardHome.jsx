import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import ManufacturerDashboard from './ManufacturerDashboard';
import HospitalDashboard from './HospitalDashboard';

const DashboardHome = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  // Route to correct dashboard based on role - NO LOADING STATE
  if (!user) {
    return null; // Brief flash only, no spinner
  }

  if (user.role === 'admin') {
    return <AdminDashboard />;
  } else if (user.role === 'manufacturer') {
    return <ManufacturerDashboard />;
  } else if (user.role === 'hospital') {
    return <HospitalDashboard />;
  }

  // Fallback for unknown roles
  return <HospitalDashboard />;
};

export default DashboardHome;
